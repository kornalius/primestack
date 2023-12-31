import { defineStore } from 'pinia'
import { ComputedRef } from 'vue'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
// eslint-disable-next-line import/no-cycle
import { useFeathersService } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import { schema as statSchema } from '@/shared/schemas/stats'

type Stat = Static<typeof statSchema>

interface StatOptions {
  tableId: string
  field: string
  groupFields?: string[]
  query?: AnyData
}

interface NewStatOptions extends StatOptions {
  type: string
}

export const useStats = defineStore('stats', () => {
  const update = async (tableId: string) => {
    const statService = useFeathersService('stats')
    const stats = statService.findInStore({ query: { path: tableId } })

    stats?.data?.value.forEach((s) => {
      statService.patch(s._id, {
        uuid: s._id,
        path: tableId,
        field: s.field,
        type: s.type,
        groupFields: s.groupFields,
        query: s.query,
      })
    })
  }

  const newStat = (options: NewStatOptions): ComputedRef<Stat> => {
    const {
      tableId,
      field,
      type,
      groupFields,
      query,
    } = options

    const statService = useFeathersService('stats')

    const s = statService.findOneInStore({
      query: {
        path: tableId,
        field,
        type,
        groupFields,
        query,
      },
    })

    let id: string

    if (!s.value) {
      id = hexObjectId()
      statService.create({
        uuid: id,
        path: tableId,
        field,
        type,
        groupFields,
        query,
      })
    } else {
      id = s.value._id
      statService.patch(s.value._id, {
        uuid: s.value._id,
        path: tableId,
        field: s.value.field,
        type: s.value.type,
        groupFields: s.value.groupFields,
        query: s.value.query,
      })
    }

    const { data } = statService.useGet(id)

    return data
  }

  const count = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'count' })
  )

  const avg = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'avg' })
  )

  const sum = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'sum' })
  )

  const min = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'min' })
  )

  const max = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'max' })
  )

  const empty = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: 'empty' })
  )

  const notEmpty = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: '!empty' })
  )

  const pctEmpty = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: '%empty' })
  )

  const pctNotEmpty = (options: StatOptions): ComputedRef<Stat> => (
    newStat({ ...options, type: '%!empty' })
  )

  const getStat = (tableId: string, type: string, field: string, groupFields?: string[]): Stat | undefined => {
    const statService = useFeathersService('stats')

    return statService.findOneInStore({
      query: {
        path: tableId,
        field,
        type,
        groupFields,
      },
    })
  }

  return {
    update,
    newStat,
    count,
    avg,
    sum,
    min,
    max,
    empty,
    notEmpty,
    pctEmpty,
    pctNotEmpty,
    getStat,
  }
})

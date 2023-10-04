import { defineStore } from 'pinia'
import { ComputedRef } from 'vue'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useFeathers } from '@/composites/feathers'
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
  const newStat = (options: NewStatOptions): ComputedRef<Stat> => {
    const { api } = useFeathers()

    const {
      tableId,
      field,
      type,
      groupFields,
      query,
    } = options

    const id = hexObjectId()

    api.service('stats').create({
      uuid: id,
      path: tableId,
      field,
      type,
      groupFields,
      query,
    })

    // return computed(() => ({ _id: id, uuid: id, path: tableId, field, type, value: 0 }))
    const { data } = api.service('stats').useGet(id)

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
    const { api } = useFeathers()

    return api.service('stats').findOneInStore({
      query: {
        path: tableId,
        field,
        type,
        groupFields,
      },
    })
  }

  return {
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

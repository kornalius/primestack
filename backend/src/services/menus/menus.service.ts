import { Application } from '@feathersjs/koa'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import { Static } from '@feathersjs/typebox'
import { virtual } from '@feathersjs/schema'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema, menuSchema, tabSchema } from '@/shared/schemas/menu'
import { schema as shareSchema } from '@/shared/schemas/share'
import { schema as formListSchema, formSchema } from '@/shared/schemas/form'
import { dataValidator } from '@/validators'
import { HookContext } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'

type MenuSchema = Static<typeof schema>
type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type FormSchema = Static<typeof formListSchema>
type Form = Static<typeof formSchema>
type Share = Static<typeof shareSchema>

dataValidator.addSchema(schema)

const path = 'menus'
const collection = 'menus'

class Service extends MongoService {}

export default function (app: Application): void {
  const getFormIds = (value: MenuSchema): string[] => (
    value?.list.reduce((acc: string[], m: Menu) => ([
      ...acc,
      ...m.tabs
        .filter((t: Tab) => t.formId)
        .map((t: Tab) => t.formId?.toString())
    ]), []) || []
  )

  // return a list of menu ids in the list
  const menuIds = virtual(async (value: MenuSchema) => (
    value?.list.map((m: Menu) => m._id.toString())
  ))

  // return a list of all form ids defined in the menu tabs
  const formIds = virtual(async (value: MenuSchema) => (
    getFormIds(value)
  ))

  // return a list of all table ids that are defined in the forms of the menu tabs
  const tableIds = virtual(async (value: MenuSchema, context: HookContext) => {
    // get all form ids used in the menu list
    const formIds = getFormIds(value)
    if (!formIds || formIds.length === 0) {
      return []
    }

    const formsLists = (await context.app.service('forms').find({
      query: {
        formIds: { $in: formIds }
      },
    })).data as FormSchema[]

    return formsLists
      // flatten all the form's lists
      .reduce((acc: Form[], f: FormSchema) => ([...acc, ...f.list]), [])
      // filter forms in formIds with a tableId
      .filter((f: Form) => f.tableId && formIds.includes(f._id.toString()))
      .map((f: Form) => f.tableId?.toString())
  })

  // return a list of user ids that this menu is shared with
  const userIds = virtual(async (value: MenuSchema, context: HookContext) => {
    // extract all menu ids from the list
    const menuIds = value?.list.map((m: Menu) => m._id)
    if (!menuIds || menuIds.length === 0) {
      return []
    }

    // get all shares with one of these menu ids
    const shares = (await context.app.service('shares').find({
      query: {
        menuId: { $in: menuIds },
      },
    })).data as Share[]

    return [
      // always return the creator of this menu
      (value as AnyData).createdBy,
      ...shares
        .filter((s: Share) => {
          // check if share is still valid
          if (!s.disabled) {
            // check for within dates validity
            if (isEmpty(s.validFrom) && isEmpty(s.validUntil)) {
              return true
            }
            const from = dayjs(s.validFrom)
            const to = dayjs(s.validUntil)
            const now = dayjs()
            if (now.isSame(from)
              || now.isSame(to)
              || (now.isAfter(from) && now.isBefore(to))) {
              return true
            }
          }
          return false
        })
        .map((s: Share) => s.userId?.toString())
    ]
  })

  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    user: true,
    authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    resolvers: {
      data: {
        menuIds,
        formIds,
        tableIds,
        userIds,
      },
      result: {
        menuIds,
        formIds,
        tableIds,
        userIds,
      },
    },
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

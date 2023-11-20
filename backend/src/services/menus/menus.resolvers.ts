import { Static } from '@feathersjs/typebox'
import compact from 'lodash/compact'
import { virtual } from '@feathersjs/schema'
import { HookContext } from '@/declarations'
import { menuSchema, schema, tabSchema } from '@/shared/schemas/menu'
import { formSchema, schema as formListSchema } from '@/shared/schemas/form'
import { schema as shareSchema } from '@/shared/schemas/share'
import { isShareValid } from '@/shared/share'

type MenuList = Static<typeof schema>
type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type FormList = Static<typeof formListSchema>
type Form = Static<typeof formSchema>
type Share = Static<typeof shareSchema>

const getFormIds = (value: MenuList): string[] => (
  value?.list.reduce((acc: string[], m: Menu) => ([
    ...acc,
    ...m.tabs
      .filter((t: Tab) => t.formId)
      .map((t: Tab) => t.formId?.toString())
  ]), []) || []
)

// return a list of menu ids in the list
const menuIds = virtual(async (value: MenuList) => (
  value?.list.map((m: Menu) => m._id.toString())
))

// return a list of all form ids defined in the menu tabs
const formIds = virtual(async (value: MenuList) => (
  getFormIds(value)
))

// return a list of all table ids that are defined in the forms of the menu tabs
const tableIds = virtual(async (value: MenuList, context: HookContext) => {
  // get all form ids used in the menu list
  const formIds = getFormIds(value)
  if (!formIds || formIds.length === 0) {
    return []
  }

  const formsLists = (await context.app.service('forms').find({
    query: {
      formIds: { $in: formIds },
      $limit: -1,
      $skip: 0,
    },
  })).data as FormList[]

  return formsLists
    // flatten all the form's lists
    .reduce((acc: Form[], f: FormList) => ([...acc, ...f.list]), [])
    // filter forms in formIds with a tableId
    .filter((f: Form) => f.tableId && formIds.includes(f._id.toString()))
    .map((f: Form) => f.tableId?.toString())
})

// return a list of user ids that each menu is shared with
const userIds = virtual(async (value: MenuList, context: HookContext) => {
  // extract all menu ids from the list
  const menuIds = value?.list.map((m: Menu) => m._id)
  if (!menuIds || menuIds.length === 0) {
    return []
  }

  // get all shares with one of these menu ids
  const shares = (await context.app.service('shares').find({
    query: {
      menuId: { $in: menuIds },
      $limit: -1,
      $skip: 0,
    },
  })).data as Share[]

  return compact([
    // // always return the creator of this menu
    // ...(value?.list || [])
    //   .map((m: Menu) => ({
    //     menuId: m._id.toString(),
    //     userId: (value as AnyData).createdBy?.toString(),
    //   })),

    ...(shares || [])
      .filter((s: Share) => isShareValid(s))
      .map((s: Share) => ({
        menuId: s.menuId?.toString(),
        userId: s.userId?.toString(),
      }))
  ])
})

export default {
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
}

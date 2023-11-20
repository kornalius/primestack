import { virtual } from '@feathersjs/schema'
import { HookContext } from '@/declarations'
import { Static } from '@feathersjs/typebox'
import { schema } from '@/shared/schemas/share'
import { menuSchema, schema as menuListSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema, schema as formListSchema } from '@/shared/schemas/form'

type Share = Static<typeof schema>
type MenuList = Static<typeof menuListSchema>
type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type FormList = Static<typeof formListSchema>
type Form = Static<typeof formSchema>

const getFormIds = (menu: MenuList): string[] => (
  menu?.list.reduce((acc: string[], m: Menu) => ([
    ...acc,
    ...m.tabs
      .filter((t: Tab) => t.formId)
      .map((t: Tab) => t.formId?.toString())
  ]), []) || []
)

// return a list of form ids this share provides
const formIds = virtual(async (value: Share, context: HookContext) => {
  if (!value.menuId) {
    return []
  }
  const menu = await context.app.service('menus').get(value.menuId) as MenuList
  return getFormIds(menu)
})

// return a list of form ids this share provides
const tableIds = virtual(async (value: Share, context: HookContext) => {
  if (!value.menuId) {
    return []
  }

  const menu = await context.app.service('menus').get(value.menuId) as MenuList
  const formIds = getFormIds(menu)

  const formsLists = (await context.app.service('menus').find({
    query: {
      _id: { $in: formIds },
      $limit: -1,
      $skip: 0,
    },
  })).data as FormList[]

  // flatten all the form's lists
  return formsLists
    .reduce((acc: Form[], f: FormList) => ([...acc, ...f.list]), [])
    // filter forms in formIds with a tableId
    .filter((f: Form) => f.tableId && formIds.includes(f._id.toString()))
    .map((f: Form) => f.tableId?.toString())
})

export default {
  data: {
    formIds,
    tableIds,
  },
  result: {
    formIds,
    tableIds,
  },
}

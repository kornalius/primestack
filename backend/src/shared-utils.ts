import { ObjectId } from 'mongodb'
import { Static } from '@feathersjs/typebox'
import { HookContext } from '@feathersjs/feathers'
import { isShareValid } from '@/shared/share'
import { schema } from '@/shared/schemas/share'
import { menuSchema, schema as menuListSchema } from '@/shared/schemas/menu'
import { formSchema, schema as formListSchema } from '@/shared/schemas/form'
import { tableSchema, schema as tableListSchema } from '@/shared/schemas/table'
import { actionSchema, schema as actionListSchema } from '@/shared/schemas/actions'

type Share = Static<typeof schema>
type Form = Static<typeof formSchema>
type FormList = Static<typeof formListSchema>
type Table = Static<typeof tableSchema>
type TableList = Static<typeof tableListSchema>
type Action = Static<typeof actionSchema>
type ActionList = Static<typeof actionListSchema>
type MenuList = Static<typeof menuListSchema>
type Menu = Static<typeof menuSchema>

/**
 * Retrieve valid user's shares
 *
 * @param context Hook context
 *
 * @returns {Share[]}
 */
export const getUserShares = async (context: HookContext): Promise<Share[]> => {
  // skip if from internal server
  if (!context.params.connection) {
    return []
  }

  const user = context.params?.user

  return ((await context.app.service('shares').find({
    query: {
      userId: user._id,
      $limit: -1,
      $skip: 0,
    }
  })).data as Share[])
    .filter((share) => isShareValid(share))
}

/**
 * Retrieve shared menus from user's shares
 *
 * @param context Hook context
 *
 * @returns {Promise<Menu[]>}
 */
export const getSharedMenus = async (context: HookContext): Promise<Menu[]> => {
  const shares = await getUserShares(context)

  const menuIds = (shares as Share[])
    .map((share) => share.menuId.toString())

  if (menuIds.length) {
    const { data: menus } = await context.app.service('menus').find({
      query: {
        'list._id': { $in: menuIds.map((id) => new ObjectId(id)) },
        $limit: -1,
        $skip: 0,
      }
    })

    return menus
      .reduce((acc: Menu[], m: MenuList) => [...acc, ...m.list], [])
      .filter((m: Menu) => menuIds.includes(m._id.toString()))
      .map((m: Menu) => {
        const shareId = shares.find((s: Share) => (
          s.menuId.toString() === m._id.toString()
        ))
        return {
          ...m,
          shareId,
        }
      })
  }

  return []
}

/**
 * Retrieve shared forms from user's shares
 *
 * @param context Hook context
 *
 * @returns {Promise<Form[]>}
 */
export const getSharedForms = async (context: HookContext): Promise<Form[]> => {
  const shares = await getUserShares(context)

  const formIds = shares
    .reduce((acc, s) => [
      ...acc,
      ...s.formIds.map((id) => id.toString()),
    ], [] as string[])

  if (formIds.length) {
    const { data: forms } = await context.app.service('forms').find({
      query: {
        'list._id': { $in: formIds.map((id) => new ObjectId(id)) },
        $limit: -1,
        $skip: 0,
      }
    })

    return forms
      .reduce((acc: Form[], f: FormList) => [...acc, ...f.list], [])
      .filter((f: Form) => formIds.includes(f._id.toString()))
      .map((f: Form) => {
        const shareId = shares.find((s: Share) => (
          s.formIds.map((id) => id.toString()).includes(f._id.toString())
        ))
        return {
          ...f,
          shareId,
        }
      })
  }

  return []
}

/**
 * Retrieve shared tables from user's shares
 *
 * @param context Hook context
 *
 * @returns {Promise<Table[]>}
 */
export const getSharedTables = async (context: HookContext): Promise<Table[]> => {
  const shares = await getUserShares(context)

  const tableIds = shares
    .reduce((acc, s) => [
      ...acc,
      ...s.tableIds.map((id) => id.toString()),
    ], [] as string[])

  if (tableIds.length) {
    const { data: tables } = await context.app.service('tables').find({
      query: {
        'list._id': { $in: tableIds.map((id) => new ObjectId(id)) },
        $limit: -1,
        $skip: 0,
      }
    })

    return tables
      .reduce((acc: Table[], t: TableList) => [...acc, ...t.list], [])
      .filter((t: Table) => tableIds.includes(t._id.toString()))
      .map((t: Table) => {
        const shareId = shares.find((s: Share) => (
          s.formIds.map((id) => id.toString()).includes(t._id.toString())
        ))
        return {
          ...t,
          shareId,
        }
      })
  }

  return []
}

/**
 * Retrieve shared actions from user's shares
 *
 * @param context Hook context
 *
 * @returns {Promise<Action[]>}
 */
export const getSharedActions = async (context: HookContext): Promise<Action[]> => {
  const shares = await getUserShares(context)

  const actionIds = shares
    .reduce((acc, s) => [
      ...acc,
      ...s.actionIds.map((id) => id.toString()),
    ], [] as string[])

  if (actionIds.length) {
    const { data: actions } = await context.app.service('actions').find({
      query: {
        'list._id': { $in: actionIds.map((id) => new ObjectId(id)) },
        $limit: -1,
        $skip: 0,
      }
    })

    return actions
      .reduce((acc: Action[], a: ActionList) => [...acc, ...a.list], [])
      .filter((a: Action) => actionIds.includes(a._id.toString()))
      .map((a: Action) => {
        const shareId = shares.find((s: Share) => (
          s.formIds.map((id) => id.toString()).includes(a._id.toString())
        ))
        return {
          ...a,
          shareId,
        }
      })
  }

  return []
}

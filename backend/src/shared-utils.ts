import uniq from 'lodash/uniq'
import compact from 'lodash/compact'
import { Static } from '@feathersjs/typebox'
import { HookContext } from '@feathersjs/feathers'
import { isShareValid } from '@/shared/share'
import { schema } from '@/shared/schemas/share'
import { menuSchema, schema as menuListSchema } from '@/shared/schemas/menu'
import { AnyData } from '@/shared/interfaces/commons'

type Share = Static<typeof schema>
type MenuList = Static<typeof menuListSchema>
type Menu = Static<typeof menuSchema>

export const getSharedMenus = async (context: HookContext): Promise<Menu[]> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return []
  }

  const user = context.params?.user

  const { data: shares } = await context.app.service('shares').find({
    query: {
      userId: user._id,
      $limit: -1,
      $skip: 0,
    }
  })

  const menuIds = shares
    .filter((share: Share) => isShareValid(share))
    .map((share: Share) => share.menuId.toString())

  if (menuIds.length) {
    const { data: menus } = await context.app.service('menus').find({
      query: {
        menuIds: { $in: menuIds },
        $limit: -1,
        $skip: 0,
      }
    })

    return (menus as MenuList).list
      .filter((m) => menuIds.includes(m._id.toString()))
      .map((m) => {
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

export const deepScanProp = (o: unknown, propName: string): unknown[] => {
  if (Array.isArray(o)) {
    return uniq(compact(deepScanProp(o, propName)))
  }
  if (typeof o === 'object' && o !== null) {
    const obj = (o as AnyData)
    const others = Object.keys(obj).reduce((acc: unknown[], k) => (
      [...acc, ...deepScanProp(obj[k], propName)]
    ), [])
    return uniq(compact([...others, obj[propName]]))
  }
  return []
}

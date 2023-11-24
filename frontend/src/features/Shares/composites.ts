import uniq from 'lodash/uniq'
import { TSchema } from '@feathersjs/typebox'
import { useFeathersService } from '@/composites/feathers'
import { getSchema } from '@/features/Forms/composites'
import { AnyData } from '@/shared/interfaces/commons'

const idsForSchema = (
  obj: AnyData,
  schema: TSchema,
  check: (o: AnyData) => boolean,
  path?: string,
): string[] => {
  let arr: string[] = []

  Object.keys(schema?.properties || {}).forEach((k) => {
    const p = schema.properties[k]
    if (p.type === 'array' && obj[k]) {
      (obj[k] as []).forEach((v, i) => {
        arr = [
          ...arr,
          ...idsForSchema(v, p.items, check, `${path ? `${path}.` : ''}${k}.${i}`),
        ]
      })
    } else if (p.type === 'object' && obj[k]) {
      Object.keys(obj[k]).forEach((kk) => {
        arr = [
          ...arr,
          ...idsForSchema(obj[k][kk], p, check, `${path ? `${path}.` : ''}${k}.${kk}`),
        ]
      })
    } else if (check(p) && obj[k]) {
      arr.push(obj[k])
    }
  })

  return arr
}

const deepScan = (obj: AnyData | AnyData[], check: ((o: AnyData) => boolean)): unknown[] => {
  if (Array.isArray(obj)) {
    let arr = []
    obj.forEach((o) => {
      arr = [...arr, ...deepScan(o, check)]
    })
    return arr
  }

  // eslint-disable-next-line no-underscore-dangle
  if (obj?._internalType) {
    const schema = getSchema(obj)
    return idsForSchema(obj, schema, check)
  }

  return []
}

const check = (o: AnyData): boolean => (
  o.type === 'string' && o.objectid === true
  && (['menus', 'forms', 'actions'].includes(o.service) || o.tableid === true)
)

const getEntities = (list: AnyData[], ids: string[]): AnyData[] => (
  list.filter((v) => ids.includes(v._id) && !v.shareId)
)

export const useShare = () => ({
  extractInfo: (menuId: string): {
    menuIds: string[],
    formIds: string[],
    tableIds: string[],
    actionIds: string[],
  } => {
    const userMenus = useFeathersService('menus')
      .findOneInStore({ query: {} }).value
    const userForms = useFeathersService('forms')
      .findOneInStore({ query: {} }).value
    const userTables = useFeathersService('tables')
      .findOneInStore({ query: {} }).value
    const userActions = useFeathersService('actions')
      .findOneInStore({ query: {} }).value

    const menu = userMenus.list.find((m: AnyData) => m._id === menuId && !m.shareId)

    const scanIds = (obj: AnyData | AnyData[]): string[] => {
      let ids: string[] = []
      let entities: AnyData = Array.isArray(obj) ? [...obj] : [obj]
      let oldCount = 0
      // eslint-disable-next-line no-constant-condition
      while (true) {
        ids = uniq([
          ...ids,
          ...deepScan(entities, check) as string[],
        ])

        if (oldCount === ids.length) {
          break
        }

        oldCount = ids.length

        entities = [
          ...getEntities(userMenus.list, ids),
          ...getEntities(userForms.list, ids),
          ...getEntities(userTables.list, ids),
          ...getEntities(userActions.list, ids),
        ]
      }
      return ids
    }

    const ids = scanIds(menu)

    return {
      menuIds: getEntities(userMenus.list, ids).map((v: AnyData) => v._id),
      formIds: getEntities(userForms.list, ids).map((v: AnyData) => v._id),
      tableIds: getEntities(userTables.list, ids).map((v: AnyData) => v._id),
      actionIds: getEntities(userActions.list, ids).map((v: AnyData) => v._id),
    }
  },
})

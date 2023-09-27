import { HookContext } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'

export const removeNulls = async (context: HookContext) => {
  const { method, data } = context

  if (['create', 'update', 'patch'].includes(method)) {
    const removeNull = (o: AnyData | AnyData[]) => {
      if (Array.isArray(o)) {
        o.forEach(removeNull)
        return
      }

      Object.keys(o).forEach((k) => {
        if (o[k] === null) {
          // eslint-disable-next-line no-param-reassign
          o[k] = undefined
        }
        if (typeof o[k] === 'object' || Array.isArray(o[k])) {
          removeNull(o[k])
        }
      })
    }

    removeNull(data)
  }

  return context
}

// eslint-disable-next-line import/no-cycle
import { TFrontAction, TFrontActionExecOptions } from '@/features/Actions/interface'
import globalFilter from '@/shared/actions/filter'
// eslint-disable-next-line import/no-cycle
import { exprCode, getProp, runExpr } from '@/features/Expression/composites'
import { deepKeys } from '@/composites/utilities'
import Filter from '../components/filter.vue'

const getArray = (arr: unknown, ctx: TFrontActionExecOptions): unknown[] => {
  const a = getProp(arr, ctx)
  switch (typeof a) {
    case 'number': return new Array(a as number).map((_, index) => index)
    case 'string': return (a as string).split('')
    case 'object':
      if (!Array.isArray(a)) {
        return Object.keys(a)
      }
      break
    default:
  }
  return a as unknown[]
}

export default {
  ...globalFilter,
  icon: 'mdi-filter',
  component: Filter,
  description: 'actions.filter.description',
  childrenMessage: 'actions.filter.childrenMessage',
  exec: async (ctx) => {
    const arr = getArray(ctx.value, ctx)
    return arr.filter((value, index) => (
      runExpr(exprCode(ctx.expr as string), { ...ctx.$expr, value, index })
    ))
  },
  result: (ctx): string[] => {
    const arr = getArray(ctx.value, ctx)
    return deepKeys(arr?.[0] || {})
  },
} as TFrontAction

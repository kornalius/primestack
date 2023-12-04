// eslint-disable-next-line import/no-cycle
import { TFrontAction, TFrontActionExecOptions } from '@/features/Actions/interface'
import globalMap from '@/shared/actions/map'
// eslint-disable-next-line import/no-cycle
import { exprCode, getProp, runExpr } from '@/features/Expression/composites'
import { deepKeys } from '@/composites/utilities'
import Map from '../components/map.vue'

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
  ...globalMap,
  icon: 'mdi-set-right',
  component: Map,
  description: 'actions.map.description',
  childrenMessage: 'actions.map.childrenMessage',
  exec: async (ctx) => {
    const arr = getArray(ctx.value, ctx)
    return arr.map((value, index) => (
      runExpr(exprCode(ctx.expr as string), { ...ctx.$expr, value, index })
    ))
  },
  result: (ctx): string[] => {
    const arr = getArray(ctx.value, ctx)
    const res = arr.map((value, index) => (
      runExpr(exprCode(ctx.expr as string), { ...ctx.$expr, value, index })
    ))
    return deepKeys(res?.[0] || {})
  },
} as TFrontAction

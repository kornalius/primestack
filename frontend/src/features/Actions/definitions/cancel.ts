import globalCancel from '@/shared/actions/cancel'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { anyToString } from '@/composites/utilities'
import { TFrontAction } from '../interface'

export default {
  ...globalCancel,
  icon: 'mdi-timer-remove',
  description: 'actions.cancel.description',
  childrenMessage: 'actions.cancel.childrenMessage',
  exec: async (ctx) => {
    const varName = anyToString(getProp(ctx.varName, ctx))
    const i = ctx.variables.get(varName)
    clearTimeout(i)
    clearInterval(i)
  },
} as TFrontAction

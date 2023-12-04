// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalSetvar from '@/shared/actions/setvar'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Setvar from '../components/setvar.vue'

export default {
  ...globalSetvar,
  icon: 'mdi-pencil',
  component: Setvar,
  hideTitle: true,
  description: 'actions.setvar.description',
  childrenMessage: 'actions.setvar.childrenMessage',
  exec: async (ctx) => {
    const name = anyToString(getProp(ctx.name, ctx))
    const value = getProp(ctx.value, ctx)
    ctx.variables.set(name, value)
  },
} as TFrontAction

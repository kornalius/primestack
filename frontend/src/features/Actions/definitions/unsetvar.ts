// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalUnsetvar from '@/shared/actions/unsetvar'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Unsetvar from '../components/unsetvar.vue'

export default {
  ...globalUnsetvar,
  icon: 'mdi-pencil-remove',
  component: Unsetvar,
  hideTitle: true,
  description: 'actions.unsetvar.description',
  childrenMessage: 'actions.unsetvar.childrenMessage',
  exec: async (ctx) => {
    const name = anyToString(getProp(ctx.name, ctx))
    ctx.variables.unset(name)
  },
} as TFrontAction

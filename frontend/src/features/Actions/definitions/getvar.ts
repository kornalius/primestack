// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalGetvar from '@/shared/actions/getvar'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Getvar from '../components/getvar.vue'

export default {
  ...globalGetvar,
  icon: 'mdi-progress-pencil',
  component: Getvar,
  hideTitle: true,
  description: 'actions.getvar.description',
  childrenMessage: 'actions.getvar.childrenMessage',
  exec: async (ctx) => {
    const name = anyToString(getProp(ctx.name, ctx))
    return ctx.variables.get(name)
  },
  result: (): string[] => ([]),
} as TFrontAction

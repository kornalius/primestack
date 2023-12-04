import globalConsole from '@/shared/actions/console'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { anyToString } from '@/composites/utilities'
import { TFrontAction } from '../interface'
import Console from '../components/console.vue'

export default {
  ...globalConsole,
  icon: 'mdi-console',
  component: Console,
  description: 'actions.console.description',
  childrenMessage: 'actions.console.childrenMessage',
  hideTitle: true,
  exec: async (ctx) => {
    const type = anyToString(getProp(ctx.type, ctx))
    const message = anyToString(getProp(ctx.message, ctx))
    // eslint-disable-next-line no-console
    console[type](message)
  },
  defaultValues: {
    type: 'log',
  },
} as TFrontAction

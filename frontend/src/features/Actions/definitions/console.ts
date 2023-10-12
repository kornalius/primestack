import globalConsole from '@/shared/actions/console'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '../interface'
import Console from '../components/console.vue'

export default {
  ...globalConsole,
  icon: 'mdi-console',
  component: Console,
  description: 'actions.console.description',
  childrenMessage: 'actions.console.childrenMessage',
  hideTitle: true,
  exec: async (args) => {
    // eslint-disable-next-line no-console
    console[args.type as string](args.message as string)
  },
  defaultValues: {
    type: 'log',
  },
} as TFrontAction

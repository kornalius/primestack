import globalConsole from '@/shared/actions/console'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { TFrontAction } from '../interface'
import Console from '../components/console.vue'

export default {
  ...globalConsole,
  icon: 'mdi-console',
  component: Console,
  color: 'grey-9',
  exec: async (args) => {
    // eslint-disable-next-line no-console
    console[args.type as string](getProp(args.message as string, args))
  },
  defaultValues: {
    type: 'log',
  },
} as TFrontAction

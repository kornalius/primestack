import { TFrontAction } from '@/features/Actions/interface'
import globalSetvar from '@/shared/actions/setvar'
import Setvar from '../components/setvar.vue'

export default {
  ...globalSetvar,
  icon: 'mdi-pencil',
  component: Setvar,
  hideTitle: true,
  description: 'actions.setvar.description',
  childrenMessage: 'actions.setvar.childrenMessage',
  exec: async (args) => {
    args.variables.set(args.name as string, args.value as string)
  },
} as TFrontAction

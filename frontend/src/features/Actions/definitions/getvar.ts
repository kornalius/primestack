import { TFrontAction } from '@/features/Actions/interface'
import globalGetvar from '@/shared/actions/getvar'
import Getvar from '../components/getvar.vue'

export default {
  ...globalGetvar,
  icon: 'mdi-progress-pencil',
  component: Getvar,
  hideTitle: true,
  description: 'actions.getvar.description',
  childrenMessage: 'actions.getvar.childrenMessage',
  exec: async (args) => (
    args.variables.get(args.name as string)
  ),
  result: (): string[] => ([]),
} as TFrontAction

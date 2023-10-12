import { TFrontAction } from '@/features/Actions/interface'
import globalUnsetvar from '@/shared/actions/unsetvar'
import Unsetvar from '../components/unsetvar.vue'

export default {
  ...globalUnsetvar,
  icon: 'mdi-pencil-remove',
  component: Unsetvar,
  hideTitle: true,
  description: 'actions.unsetvar.description',
  childrenMessage: 'actions.unsetvar.childrenMessage',
  exec: async (args) => {
    args.variables.unsetVariable(args.name as string)
  },
} as TFrontAction

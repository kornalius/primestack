import { TFrontAction } from '@/features/Actions/interface'
import globalSetvar from '@/shared/actions/setvar'
import Setvar from '../components/setvar.vue'

export default {
  ...globalSetvar,
  icon: 'mdi-pencil',
  color: 'blue-6',
  component: Setvar,
  exec: async ({ name, value, store }) => {
    store.setVariable(name, value)
  },
} as TFrontAction

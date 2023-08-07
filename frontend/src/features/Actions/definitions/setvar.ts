import { TFrontAction } from '@/features/Actions/interface'
import globalSetvar from '@/shared/actions/setvar'
import setvar from '../components/setvar.vue'

export default {
  ...globalSetvar,
  icon: 'mdi-pencil',
  color: 'blue-6',
  component: setvar,
  exec: ({ name, value, store }) => {
    store.setVariable(name, value)
  },
} as TFrontAction

import { TFrontAction } from '@/features/Actions/interface'
import globalUnsetvar from '@/shared/actions/unsetvar'
import Unsetvar from '../components/unsetvar.vue'

export default {
  ...globalUnsetvar,
  icon: 'mdi-pencil-remove',
  color: 'red-5',
  component: Unsetvar,
  exec: async ({ name, store }) => {
    store.unsetVariable(name)
  },
} as TFrontAction

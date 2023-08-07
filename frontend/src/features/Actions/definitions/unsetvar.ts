import { TFrontAction } from '@/features/Actions/interface'
import globalUnsetvar from '@/shared/actions/unsetvar'
import unsetvar from '../components/unsetvar.vue'

export default {
  ...globalUnsetvar,
  icon: 'mdi-pencil-remove',
  color: 'orange-5',
  component: unsetvar,
  exec: ({ name, store }) => {
    store.unsetVariable(name)
  },
} as TFrontAction

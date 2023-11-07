import { TFrontAction } from '@/features/Actions/interface'
import { normalizeName } from '@/shared/user'
import globalSetsetting from '@/shared/actions/setsetting'
import Setsetting from '../components/setsetting.vue'

export default {
  ...globalSetsetting,
  icon: 'mdi-pencil',
  component: Setsetting,
  hideTitle: true,
  description: 'actions.setsetting.description',
  childrenMessage: 'actions.setsetting.childrenMessage',
  exec: async (args) => {
    // eslint-disable-next-line no-param-reassign
    args.auth.user.settings[normalizeName(args.name as string)] = args.value as string
    args.auth.user.save()
  },
} as TFrontAction

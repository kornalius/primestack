import { TFrontAction } from '@/features/Actions/interface'
import { normalizeName } from '@/shared/user'
import globalUnsetsetting from '@/shared/actions/unsetsetting'
import Unsetsetting from '../components/unsetsetting.vue'

export default {
  ...globalUnsetsetting,
  icon: 'mdi-pencil-remove',
  component: Unsetsetting,
  hideTitle: true,
  description: 'actions.unsetsetting.description',
  childrenMessage: 'actions.unsetsetting.childrenMessage',
  exec: async (args) => {
    // eslint-disable-next-line no-param-reassign
    delete args.auth.user.settings[normalizeName(args.name as string)]
    args.auth.user.save()
  },
} as TFrontAction

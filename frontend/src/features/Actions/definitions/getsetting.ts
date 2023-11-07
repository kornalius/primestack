import { TFrontAction } from '@/features/Actions/interface'
import globalGetsetting from '@/shared/actions/getsetting'
import Getsetting from '../components/getsetting.vue'

export default {
  ...globalGetsetting,
  icon: 'mdi-account-cog',
  component: Getsetting,
  hideTitle: true,
  description: 'actions.getsetting.description',
  childrenMessage: 'actions.getsetting.childrenMessage',
  exec: async (args) => (
    args.auth.user.settings[args.name as string]
  ),
  result: (): string[] => ([]),
} as TFrontAction

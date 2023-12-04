// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalGetsetting from '@/shared/actions/getsetting'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Getsetting from '../components/getsetting.vue'

export default {
  ...globalGetsetting,
  icon: 'mdi-account-cog',
  component: Getsetting,
  hideTitle: true,
  description: 'actions.getsetting.description',
  childrenMessage: 'actions.getsetting.childrenMessage',
  exec: async (ctx) => {
    const name = anyToString(getProp(ctx.name, ctx))
    return ctx.auth.user.settings[name]
  },
  result: (): string[] => ([]),
} as TFrontAction

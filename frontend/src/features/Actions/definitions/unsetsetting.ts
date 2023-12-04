// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import { normalizeName } from '@/shared/user'
import globalUnsetsetting from '@/shared/actions/unsetsetting'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Unsetsetting from '../components/unsetsetting.vue'

export default {
  ...globalUnsetsetting,
  icon: 'mdi-pencil-remove',
  component: Unsetsetting,
  hideTitle: true,
  description: 'actions.unsetsetting.description',
  childrenMessage: 'actions.unsetsetting.childrenMessage',
  exec: async (ctx) => {
    const name = normalizeName(anyToString(getProp(ctx.name, ctx)))
    // eslint-disable-next-line no-param-reassign
    delete ctx.auth.user.settings[name]
    ctx.auth.user.save()
  },
} as TFrontAction

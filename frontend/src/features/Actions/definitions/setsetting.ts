// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import { normalizeName } from '@/shared/user'
import globalSetsetting from '@/shared/actions/setsetting'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Setsetting from '../components/setsetting.vue'

export default {
  ...globalSetsetting,
  icon: 'mdi-pencil',
  component: Setsetting,
  hideTitle: true,
  description: 'actions.setsetting.description',
  childrenMessage: 'actions.setsetting.childrenMessage',
  exec: async (ctx) => {
    const name = normalizeName(anyToString(getProp(ctx.name, ctx)))
    // eslint-disable-next-line no-param-reassign
    ctx.auth.user.settings[name] = anyToString(getProp(ctx.value, ctx))
    ctx.auth.user.save()
  },
} as TFrontAction

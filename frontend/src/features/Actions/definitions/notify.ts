import hexObjectId from 'hex-object-id'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalNotify from '@/shared/actions/notify'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { SnackType } from '@/shared/interfaces/snacks'
import Notify from '../components/notify.vue'

export default {
  ...globalNotify,
  icon: (value?) => {
    switch (value?.level || '') {
      case 'Info': return 'mdi-information'
      case 'Error': return 'mdi-alert-circle'
      case 'Warning': return 'mdi-alert-circle'
      case 'Success': return 'mdi-check-circle'
      default: return 'mdi-message'
    }
  },
  iconColor: (value?) => {
    switch (value?.level || '') {
      case 'Info': return 'info'
      case 'Error': return 'negative'
      case 'Warning': return 'warning'
      case 'Success': return 'positive'
      default: return 'green-4'
    }
  },
  component: Notify,
  hideTitle: true,
  description: 'actions.notify.description',
  childrenMessage: 'actions.notify.childrenMessage',
  exec: async (ctx) => {
    const level = anyToString(getProp(ctx.level, ctx)) as SnackType
    const message = anyToString(getProp(ctx.message, ctx))
    ctx.snacks.pushSnack({
      id: hexObjectId(),
      level,
      message,
    })
  },
} as TFrontAction

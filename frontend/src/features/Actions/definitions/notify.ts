import hexObjectId from 'hex-object-id'
import { TFrontAction } from '@/features/Actions/interface'
import globalNotify from '@/shared/actions/notify'
import notify from '../components/notify.vue'

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
  color: 'green-4',
  component: notify,
  exec: ({
    level,
    message,
    snacks,
  }) => {
    snacks.pushSnack({
      id: hexObjectId(),
      level: level as string,
      message: message as string,
    })
  },
} as TFrontAction

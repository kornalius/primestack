import hexObjectId from 'hex-object-id'
import { TFrontAction } from '@/features/Actions/interface'
import { AnyData } from '@/shared/interfaces/commons'
import globalNotify from '@/shared/actions/notify'
import notify from '../components/notify.vue'

export default {
  ...globalNotify,
  component: notify,
  exec: ({
    level,
    message,
    snacks,
  }) => {
    (snacks as AnyData).pushSnack({
      id: hexObjectId(),
      level: level as string,
      message: message as string,
    })
  },
} as TFrontAction

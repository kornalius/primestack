import globalCancel from '@/shared/actions/cancel'
import { TFrontAction } from '../interface'

export default {
  ...globalCancel,
  icon: 'mdi-timer-remove',
  description: 'actions.cancel.description',
  childrenMessage: 'actions.cancel.childrenMessage',
  exec: async (args) => {
    const i = args.variables.get(args.varName as string)
    clearTimeout(i)
    clearInterval(i)
  },
} as TFrontAction

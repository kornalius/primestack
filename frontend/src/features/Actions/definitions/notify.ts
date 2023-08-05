import schema from '@/shared/schemas/actions/notify'
import { TFrontAction } from '@/features/Actions/interface'

export default {
  type: 'notify',
  label: 'Notify',
  description: 'Display a notification bar',
  icon: 'mdi-message',
  color: 'green-4',
  schema,
} as TFrontAction

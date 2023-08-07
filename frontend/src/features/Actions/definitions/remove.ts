import { TFrontAction } from '@/features/Actions/interface'
import globalRemove from '@/shared/actions/remove'

export default {
  ...globalRemove,
  icon: 'mdi-database-minus',
  color: 'grey-9',
} as TFrontAction

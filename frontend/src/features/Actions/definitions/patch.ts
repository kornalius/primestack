import { TFrontAction } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'

export default {
  ...globalPatch,
  icon: 'mdi-database-edit',
  color: 'grey-9',
} as TFrontAction

import { TFrontAction } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'

export default {
  ...globalPatch,
} as TFrontAction

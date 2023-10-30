import { QSpace } from 'quasar'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties } from './common'

export default {
  type: 'space',
  icon: 'mdi-keyboard-space',
  label: 'components.space.label',
  component: QSpace,
  nokey: true,
  schema: properties([], false),
  defaultValues: {
  },
} as TFormComponent

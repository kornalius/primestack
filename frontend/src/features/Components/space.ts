import { QSpace } from 'quasar'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties } from './common'

export default {
  type: 'space',
  icon: 'mdi-keyboard-space',
  label: 'Spacer',
  component: QSpace,
  schema: properties([]),
  defaultValues: {
  },
} as TFormComponent

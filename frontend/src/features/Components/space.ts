import { QSpace } from 'quasar'
import { contentIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties } from './common'

export default {
  type: 'space',
  icon: 'mdi-keyboard-space',
  label: 'Spacer',
  component: QSpace,
  nokey: true,
  schema: properties([], false),
  defaultValues: {
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
      ],
    },
  },
} as TFormComponent

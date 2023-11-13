import { QSpace } from 'quasar'
import { TFormComponent } from '@/shared/interfaces/forms'
import { contentIcon } from '@/shared/icons'
import { properties } from './common'

export default {
  type: 'space',
  icon: 'mdi-keyboard-space',
  label: 'components.space.label',
  component: QSpace,
  nokey: true,
  schema: properties([], false),
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'renderWhen',
      ],
    },
  },
  defaultValues: {
  },
} as TFormComponent

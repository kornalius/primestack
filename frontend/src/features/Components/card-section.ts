import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'card-section',
  icon: 'mdi-card-text-outline',
  label: 'Card Section',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Object({
      horizontal: Type.Boolean(),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ], false),
  defaultValues: {
    horizontal: false,
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'horizontal',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

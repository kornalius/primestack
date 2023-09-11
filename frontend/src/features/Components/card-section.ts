import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'card-section',
  icon: 'mdi-card-text-outline',
  label: 'Card Section',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      horizontal: Type.Boolean(),
    }),
  ], false),
  defaultValues: {
    horizontal: false,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'horizontal',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'card-section',
  icon: 'mdi-card-text-outline',
  label: 'components.card-section.label',
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
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'horizontal',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

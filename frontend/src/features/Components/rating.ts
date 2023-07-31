import { QRating } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'rating',
  icon: 'mdi-star',
  label: 'Rating',
  component: QRating,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    Type.Object({
      modelValue: Type.Number(),
      icon: Type.String({ icon: true }),
      iconSelected: Type.String({ icon: true }),
      iconHalf: Type.String({ icon: true }),
      max: Type.Number(),
      noReset: Type.Boolean(),
      noDimming: Type.Boolean(),
      color: Type.String({ color: true }),
      colorSelected: Type.String({ color: true }),
      colorHalf: Type.String({ color: true }),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  defaultValues: {
    dense: true,
    icon: 'mdi-star-outline',
    iconSelected: 'mdi-star',
    iconHalf: 'mdi-star-half-full',
    max: 5,
    size: 'sm',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'modelValue',
        'field',
        'max',
        'disable',
        'readonly',
        'icon',
        'iconSelected',
        'iconHalf',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'colorSelected',
        'colorHalf',
        'noReset',
        'noDimming',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

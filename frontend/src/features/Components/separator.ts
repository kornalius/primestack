import { QSeparator } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'separator',
  icon: 'mdi-minus',
  label: 'Separator',
  component: QSeparator,
  nokey: true,
  schema: properties([
    Type.Object({
      spaced: Type.Boolean(),
      inset: Type.Boolean(),
      vertical: Type.Boolean(),
      color: Type.String({ color: true }),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ], false),
  defaultValues: {
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'color',
        'vertical',
        'spaced',
        'inset',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

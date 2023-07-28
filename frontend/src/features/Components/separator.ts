import { QSeparator } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'separator',
  icon: 'mdi-minus',
  label: 'Separator',
  component: QSeparator,
  schema: properties([
    Type.Object({
      spaced: Type.Boolean(),
      inset: Type.Boolean(),
      vertical: Type.Boolean(),
      color: Type.String({ color: true }),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  defaultValues: {
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
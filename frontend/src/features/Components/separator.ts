import { QSeparator } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, padding, margin,
} from './common'

export default {
  type: 'separator',
  icon: 'mdi-minus',
  label: 'components.separator.label',
  component: QSeparator,
  overlayStyles: {
    padding: '16px 0',
  },
  nokey: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      spaced: Type.Boolean(),
      inset: Type.Boolean(),
      vertical: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
    }),
  ], false),
  defaultValues: {
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
        'color',
        'vertical',
        'spaced',
        'inset',
        padding,
        margin,
      ],
    },
  },
} as TFormComponent

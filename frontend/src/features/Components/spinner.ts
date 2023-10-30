import { QSpinnerIos } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'spinner',
  icon: 'mdi-vanish',
  label: 'components.spinner.label',
  component: QSpinnerIos,
  nokey: true,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      color: ExType.Color({ quasarPalette: true }),
      thickness: Type.Number(),
    }),
  ], false),
  defaultValues: {
    color: 'primary',
    size: 'sm',
    ...defaultStyleValues,
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'thickness',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

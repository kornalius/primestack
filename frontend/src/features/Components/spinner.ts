import { QSpinnerIos } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import { properties, commonProperties, defaultStyleValues } from './common'

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
      color: ExType.Color(),
      thickness: Type.Number(),
    }),
  ], false),
  defaultValues: {
    color: 'primary',
    size: 'sm',
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
        'size',
        'color',
        'thickness',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

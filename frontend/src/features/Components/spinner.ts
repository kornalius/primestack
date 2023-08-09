import { QSpinnerIos } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'spinner',
  icon: 'mdi-vanish',
  label: 'Spinner',
  component: QSpinnerIos,
  nokey: true,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      color: Type.String({ color: true }),
      thickness: Type.Number(),
    }),
  ], false),
  defaultValues: {
    color: 'primary',
    size: 'sm',
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'thickness',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

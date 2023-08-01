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
    commonProperties.style,
    Type.Object({
      color: Type.String({ color: true }),
      thickness: Type.Number(),
    }),
  ], false),
  defaultValues: {
    color: 'primary',
    thickness: 5,
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'size',
        'color',
        'thickness',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

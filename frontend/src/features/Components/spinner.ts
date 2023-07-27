import { QSpinnerIos } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'spinner',
  icon: 'mdi-vanish',
  label: 'Spinner',
  component: QSpinnerIos,
  schema: properties([
    commonProperties.size,
    Type.Object({
      color: Type.String({ color: true }),
      thickness: Type.Number(),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    color: 'primary',
    thickness: 5,
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

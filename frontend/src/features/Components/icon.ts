import { QIcon } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'icon',
  icon: 'mdi-cube-outline',
  label: 'Icon',
  component: QIcon,
  noName: true,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    Type.Object({
      name: Type.String({ icon: true }),
      left: Type.Boolean(),
      right: Type.Boolean(),
      color: Type.String({ color: true }),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    size: 'md',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'disable',
        'readonly',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'size',
        'color',
        'left',
        'right',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent
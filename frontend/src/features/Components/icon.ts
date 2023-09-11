import { QIcon } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'icon',
  icon: 'mdi-cube-outline',
  label: 'Icon',
  component: QIcon,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.String({ icon: true }),
      left: Type.Boolean(),
      right: Type.Boolean(),
      color: Type.String({ color: true }),
    }),
  ]),
  defaultValues: {
    size: 'md',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'left',
        'right',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

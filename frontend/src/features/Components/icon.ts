import { QIcon } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'icon',
  icon: 'mdi-cube-outline',
  label: 'components.icon.label',
  component: QIcon,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      icon: ExType.Icon(),
      left: Type.Boolean(),
      right: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      backgroundColor: ExType.Color(),
    }),
  ]),
  modelValueField: 'icon',
  defaultValues: {
    size: 'md',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'icon',
        'field',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'left',
        'right',
        'backgroundColor',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

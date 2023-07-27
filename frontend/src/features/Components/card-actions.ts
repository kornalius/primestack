import { StringEnum, Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'card-actions',
  icon: 'mdi-gesture-tap-button',
  label: 'Card Actions',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Object({
      align: StringEnum([
        'left',
        'center',
        'right',
        'between',
        'around',
        'evenly',
        'stretch',
      ]),
      vertical: Type.Boolean(),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  defaultValues: {
    align: 'right',
    vertical: false,
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'align',
        'vertical',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

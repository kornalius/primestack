import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'card-actions',
  icon: 'mdi-gesture-tap-button',
  label: 'components.card-actions.label',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
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
  ], false),
  defaultValues: {
    align: 'right',
    vertical: false,
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
        'align',
        'vertical',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

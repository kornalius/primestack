import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import FormElementCard from '@/features/Forms/components/Editor/FormElementCard.vue'
import { properties, commonProperties } from './common'

export default {
  type: 'card',
  icon: 'mdi-card-bulleted',
  label: 'Card',
  component: FormElementCard,
  row: true,
  col: true,
  nokey: true,
  schema: properties([
    Type.Object({
      square: Type.Boolean(),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  defaultValues: {
    _columns: () => ([
      {
        _id: hexObjectId(),
        _type: 'card-section',
        _fields: [],
        horizontal: false,
        padding: {},
        margin: {},
      },
      {
        _id: hexObjectId(),
        _type: 'card-actions',
        _fields: [],
        align: 'right',
        vertical: false,
        padding: {},
        margin: {},
      },
    ]),
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'square',
        'flat',
        'bordered',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

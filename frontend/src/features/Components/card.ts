import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
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
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      square: Type.Boolean(),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
    }),
  ], false),
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
    content: {
      icon: contentIcon,
      names: [
        'name',
      ],
    },
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

import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import FormElementCard from '@/features/Forms/components/Editor/FormElementCard.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'card',
  icon: 'mdi-card-bulleted',
  label: 'components.card.label',
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
      backgroundColor: ExType.Color(),
    }),
  ], false),
  defaultValues: {
    _columns: () => ([
      {
        _id: hexObjectId(),
        _type: 'card-section',
        _fields: [],
        horizontal: false,
        ...defaultStyleValues,
      },
      {
        _id: hexObjectId(),
        _type: 'card-actions',
        _fields: [],
        align: 'right',
        vertical: false,
        ...defaultStyleValues,
      },
    ]),
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'backgroundColor',
        'square',
        'flat',
        'bordered',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

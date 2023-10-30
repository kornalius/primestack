import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import FormElementRow from '@/features/Forms/components/Editor/FormElementRow.vue'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'row',
  icon: 'mdi-view-column-outline',
  label: 'components.row.label',
  component: FormElementRow,
  row: true,
  nokey: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
  ], false),
  defaultValues: {
    _columns: () => ([
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        ...defaultStyleValues,
      },
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        ...defaultStyleValues,
      },
    ]),
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        ...styleNames,
      ],
    },
  },
} as TFormComponent

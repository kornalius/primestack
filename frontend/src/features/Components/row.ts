import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import FormElementRow from '@/features/Forms/components/Editor/FormElementRow.vue'
import { properties, commonProperties } from './common'

export default {
  type: 'row',
  icon: 'mdi-view-column-outline',
  label: 'Row',
  component: FormElementRow,
  row: true,
  nokey: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  defaultValues: {
    _columns: () => ([
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        padding: {},
        margin: {},
      },
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        padding: {},
        margin: {},
      },
    ]),
  },
  categories: {
    style: {
      icon: styleIcon,
      names: [
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

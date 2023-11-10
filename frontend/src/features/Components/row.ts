import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { styleIcon } from '@/shared/icons'
import { hAlignString, sizeString, vAlignString } from '@/shared/interfaces/commons'
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
    Type.Object({
      hGutter: sizeString,
      vGutter: sizeString,
      items: vAlignString,
      justify: hAlignString,
    }),
  ], false),
  defaultValues: {
    hGutter: 'xs',
    vGutter: 'xs',
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
        {
          label: 'Gutters',
          children: [
            { label: 'Horizontal', name: 'hGutter' },
            { label: 'Vertical', name: 'vGutter' },
          ],
        },
        'items',
        'justify',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

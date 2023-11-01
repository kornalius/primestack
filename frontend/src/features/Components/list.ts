import { Type } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'list',
  icon: 'mdi-format-list-text',
  label: 'components.list.label',
  list: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      iterationVar: ExType.Variable(),
      loopExpr: ExType.Expr(),
      tableId: ExType.Table(),
      query: ExType.Query({ tableProp: '../tableId' }),
      horizontal: Type.Boolean(),
      virtualScroll: Type.Boolean(),
      virtualScrollSliceSize: Type.Number(),
      virtualScrollSliceRatioBefore: Type.Number(),
      virtualScrollSliceRatioAfter: Type.Number(),
      virtualScrollItemSize: Type.Number(),
      virtualScrollStickySizeStart: Type.Number(),
      virtualScrollStickySizeEnd: Type.Number(),
      backgroundColor: ExType.Color(),
    }),
  ], false),
  defaultValues: {
    ...defaultStyleValues,
    virtualScrollItemSize: 24,
    _columns: [
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        virtualScrollItemSize: 24,
      },
    ],
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        { name: 'iterationVar', label: 'Variable' },
        { name: 'loopExpr', label: 'Expression' },
        { name: 'tableId', label: 'Table' },
        'query',
        'horizontal',
        {
          label: 'Virtual Scroll',
          sectionColor: 'purple-1',
          children: [
            { name: 'virtualScroll', label: 'Enabled' },
            { name: 'virtualScrollItemSize', label: 'Item Size' },
            { name: 'virtualScrollSliceSize', label: 'Slice Size' },
            { name: 'virtualScrollSliceRatioBefore', label: 'Slice Ratio Before' },
            { name: 'virtualScrollSliceRatioAfter', label: 'Slice Ratio After' },
            { name: 'virtualScrollStickySizeStart', label: 'Sticky Size Start' },
            { name: 'virtualScrollStickySizeEnd', label: 'Sticky Size End' },
          ],
        },
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'backgroundColor',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

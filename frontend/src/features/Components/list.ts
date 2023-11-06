import { Static, Type } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import { extractKeyTypesFromArray } from '@/composites/utilities'
import { AnyData } from '@/shared/interfaces/commons'
import { fieldSchema } from '@/shared/schemas/form'
import { tableFieldSchema } from '@/shared/schemas/table'
// eslint-disable-next-line import/no-cycle
import { exprCode, isExpr, runExpr } from '@/features/Expression/composites'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

type FormField = Static<typeof fieldSchema>
type TableFieldSchema = Static<typeof tableFieldSchema>

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
  fields: (field: FormField, ctx: AnyData): TableFieldSchema[] => {
    let lst = [] as TableFieldSchema[]
    // try to interpret value if loop expression specified
    const expr = (field as AnyData).loopExpr
    if (expr && isExpr(expr)) {
      const v = runExpr(exprCode(expr), ctx) as unknown[]
      if (Array.isArray(v)) {
        const keyTypes = extractKeyTypesFromArray(v)
        if (keyTypes.length) {
          lst = [
            {
              _id: hexObjectId(),
              name: '_index',
              type: 'number',
            },
            ...Object.keys(keyTypes)
              .map((k) => ({
                _id: hexObjectId(),
                name: k,
                type: keyTypes[k],
              })),
          ]
        }

        // else make the list just _index and _value
        if (lst.length === 0) {
          lst = [
            {
              _id: hexObjectId(),
              name: '_index',
              type: 'number',
            },
            {
              _id: hexObjectId(),
              name: '_value',
              type: '',
            },
          ]
        }
      }
    }
    return lst
  },
} as TFormComponent

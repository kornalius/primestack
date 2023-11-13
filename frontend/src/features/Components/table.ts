import hexObjectId from 'hex-object-id'
import { Static, StringEnum, Type } from '@feathersjs/typebox'
import ExType from '@/shared/extypes'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'
import { fieldSchema, formTableColumnSchema } from '@/shared/schemas/form'
import { tableFields } from '@/features/Tables/composites'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

type FormField = Static<typeof fieldSchema>
type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

export default {
  type: 'table',
  icon: 'mdi-table',
  label: 'components.table.label',
  component: SchemaTable,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      noRouteFullscreenExit: Type.Boolean(),
      grid: Type.Boolean(),
      gridHeader: Type.Boolean(),
      loading: Type.Boolean(),
      columns: Type.Array(formTableColumnSchema),
      editable: Type.Boolean(),
      title: Type.String(),
      hideHeader: Type.Boolean(),
      hideBottom: Type.Boolean(),
      hideSelectedBanner: Type.Boolean(),
      hideNoData: Type.Boolean(),
      hidePagination: Type.Boolean(),
      separator: StringEnum(['horizontal', 'vertical', 'cell', 'none']),
      wrapCells: Type.Boolean(),
      noDataLabel: Type.String(),
      noResultsLabel: Type.String(),
      loadingLabel: Type.String(),
      expanded: Type.Array(Type.String()),
      filter: Type.String(),
      rows: ExType.JSON({ rootType: 'object' }),
      rowKey: Type.String(),
      rowsPerPageLabel: Type.String(),
      pagination: Type.Object({
        sortBy: Type.String(),
        descending: Type.Boolean(),
        page: Type.Number(),
        rowsPerPage: Type.Number(),
        rowsNumber: Type.Number(),
      }),
      rowsPerPageOptions: Type.Array(Type.Number()),
      selectionStyle: StringEnum(['single', 'multiple', 'none']),
      binaryStateSort: Type.Boolean(),
      columnSortOrder: Type.String(),
      color: ExType.Color({ quasarPalette: true }),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
      square: Type.Boolean(),
      virtualScroll: Type.Boolean(),
      virtualScrollSliceSize: Type.Number(),
      virtualScrollSliceRatioBefore: Type.Number(),
      virtualScrollSliceRatioAfter: Type.Number(),
      virtualScrollItemSize: Type.Number(),
      virtualScrollStickySizeStart: Type.Number(),
      virtualScrollStickySizeEnd: Type.Number(),
      tableColspan: Type.Number(),
      tableId: ExType.Table(),
      query: ExType.Query(),
      temps: Type.Boolean(),
      hideFilter: Type.Boolean(),
      addButton: StringEnum(['start', 'end']),
      addLabel: Type.String(),
      addIcon: ExType.Icon(),
      addDisable: Type.Boolean(),
      removeButton: StringEnum(['end']),
      removeLabel: Type.String(),
      removeIcon: ExType.Icon(),
      removeDisable: Type.Boolean(),
      saveLabel: Type.String(),
      saveIcon: ExType.Icon(),
      cancelLabel: Type.String(),
      cancelIcon: ExType.Icon(),
      extraFields: Type.Array(Type.Object({
        fieldname: Type.String(),
        value: Type.String(),
        filter: Type.Optional(Type.Boolean()),
        create: Type.Optional(Type.Boolean()),
      }, { horizontal: true, horizontalPopup: true })),
      rowClick: ExType.Action(),
      rowDblClick: ExType.Action(),
      rowContextMenu: ExType.Action(),
      selection: ExType.Action(),
    }),
  ], false),
  defaultValues: {
    separator: 'horizontal',
    selectionStyle: 'none',
    virtualScrollSliceSize: 30,
    virtualScrollSliceRatioBefore: 1,
    virtualScrollSliceRatioAfter: 1,
    virtualScrollItemSize: 48,
    hideFilter: true,
    columns: [
      {
        _id: hexObjectId(),
        name: 'col1',
        label: 'Col1',
        align: 'left',
        sortable: true,
      },
      {
        _id: hexObjectId(),
        name: 'col2',
        label: 'Col2',
        align: 'left',
        sortable: true,
      },
    ],
    visibleColumns: [],
    rowsPerPageOptions: [10, 25, 50, 100],
    rows: [],
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'title',
        'selectionStyle',
        'filter',
        'hideFilter',
        {
          label: 'Labels',
          sectionColor: 'blue-1',
          children: [
            { name: 'noDataLabel', label: 'No data' },
            { name: 'noResultsLabel', label: 'No results' },
            { name: 'rowsPerPageLabel', label: 'Rows per page' },
            { name: 'loadingLabel', label: 'Loading' },
          ],
        },
        'rowsPerPageOptions',
        'loading',
        'binaryStateSort',
        'columnSortOrder',
        {
          label: 'Virtual Scroll',
          sectionColor: 'purple-1',
          children: [
            { name: 'virtualScroll', label: 'Enabled' },
            { name: 'virtualScrollSliceSize', label: 'Slice Size' },
            { name: 'virtualScrollSliceRatioBefore', label: 'Slice Ratio Before' },
            { name: 'virtualScrollSliceRatioAfter', label: 'Slice Ratio After' },
            { name: 'virtualScrollItemSize', label: 'Item Size' },
            { name: 'virtualScrollStickySizeStart', label: 'Sticky Size Start' },
            { name: 'virtualScrollStickySizeEnd', label: 'Sticky Size End' },
          ],
        },
        'tableColspan',
        'renderWhen',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        { name: 'tableId', label: 'Table' },
        'query',
        { name: 'temps', label: 'Show Temps' },
        'rows',
        'rowKey',
        'editable',
        { name: 'extraFields', label: 'Extra Fields' },
        {
          label: 'Add button',
          sectionColor: 'blue-1',
          children: [
            { name: 'addButton', label: 'Position' },
            { name: 'addLabel', label: 'Label' },
            { name: 'addIcon', label: 'Icon' },
            { name: 'addDisable', label: 'Disabled' },
          ],
        },
        {
          label: 'Remove button',
          sectionColor: 'red-2',
          children: [
            { name: 'removeButton', label: 'Position' },
            { name: 'removeLabel', label: 'Label' },
            { name: 'removeIcon', label: 'Icon' },
            { name: 'removeDisable', label: 'Disabled' },
          ],
        },
        {
          label: 'Save button',
          sectionColor: 'green-1',
          children: [
            { name: 'saveLabel', label: 'Label' },
            { name: 'saveIcon', label: 'Icon' },
          ],
        },
        {
          label: 'Cancel button',
          sectionColor: 'red-2',
          children: [
            { name: 'cancelLabel', label: 'Label' },
            { name: 'cancelIcon', label: 'Icon' },
          ],
        },
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'disable',
        'readonly',
        'color',
        'separator',
        'expanded',
        'flat',
        'bordered',
        'square',
        'noRouteFullscreenExit',
        'gridHeader',
        'hideHeader',
        'hideBottom',
        'hideSelectedBanner',
        'hideNoData',
        'hidePagination',
        'grid',
        'wrapCells',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'rowClick',
        'rowDblClick',
        'rowContextMenu',
        'selection',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    rowClick: (e: Event, row: AnyData, index: number) => ({
      row,
      index,
    }),
    rowDblClick: (e: Event, row: AnyData, index: number) => ({
      row,
      index,
    }),
    rowContextMenu: (e: Event, row: AnyData, index: number) => ({
      row,
      index,
    }),
    selection: ({ rows, keys, added }) => ({
      rows,
      keys,
      added,
    }),
  },
  fields: (field: FormField, editor: AnyData): TableField[] => {
    let lst = [] as TableField[]
    const tid = (field as AnyData).tableId
    if (tid) {
      const tbl = editor.tables?.find((s: Table) => s._id === tid)
      if (tbl && tbl.fields) {
        lst = tableFields(
          tbl.fields,
          tbl.created,
          tbl.updated,
          tbl.softDelete,
        )
      }
    }
    return lst
  },
} as TFormComponent

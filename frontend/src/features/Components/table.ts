import hexObjectId from 'hex-object-id'
import { StringEnum, Type } from '@feathersjs/typebox'
import ExType from '@/shared/extypes'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'
import { formTableColumnSchema } from '@/shared/schemas/form'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs,
} from './common'

export default {
  type: 'table',
  icon: 'mdi-table',
  label: 'Table',
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
      visibleColumns: Type.Array(Type.String()),
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
      rows: Type.Array(undefined, { json: true }),
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
      color: ExType.Color(),
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
      hideFilter: Type.Boolean(),
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
      },
      {
        _id: hexObjectId(),
        name: 'col2',
        label: 'Col2',
        align: 'left',
      },
    ],
    visibleColumns: [],
    rows: [],
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'title',
        'selectionStyle',
        'filter',
        'hideFilter',
        'noDataLabel',
        'noResultsLabel',
        'rowsPerPageLabel',
        'rowsPerPageOptions',
        'pagination',
        'loading',
        'loadingLabel',
        'binaryStateSort',
        'columnSortOrder',
        'virtualScroll',
        'virtualScrollSliceSize',
        'virtualScrollSliceRatioBefore',
        'virtualScrollSliceRatioAfter',
        'virtualScrollItemSize',
        'virtualScrollStickySizeStart',
        'virtualScrollStickySizeEnd',
        'tableColspan',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'tableId',
        'query',
        'rows',
        'rowKey',
        'visibleColumns',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'disabled',
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
        'border',
        'padding',
        'margin',
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
} as TFormComponent

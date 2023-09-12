import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'table',
  icon: 'mdi-table',
  label: 'Table',
  component: SchemaTable,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    Type.Object({
      noRouteFullscreenExit: Type.Boolean(),
      grid: Type.Boolean(),
      gridHeader: Type.Boolean(),
      loading: Type.Boolean(),
      columns: Type.Array(Type.Object({
        name: Type.String(),
        label: Type.String(),
        field: Type.String(),
        required: Type.Boolean(),
        align: Type.String({
          options: [
            { value: 'left', icon: 'mdi-format-align-left' },
            { value: 'center', icon: 'mdi-format-align-center' },
            { value: 'right', icon: 'mdi-format-align-right' },
          ],
          toggles: true,
        }),
        sortable: Type.Boolean(),
        sortOrder: Type.String({
          options: [
            { value: 'ad', icon: 'mdi-sort-alphabetical-ascending' },
            { value: 'da', icon: 'mdi-sort-alphabetical-descending' },
          ],
          toggles: true,
        }),
      }, { horizontalPopup: true })),
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
      selection: StringEnum(['single', 'multiple', 'none']),
      binaryStateSort: Type.Boolean(),
      columnSortOrder: Type.String(),
      color: Type.String({ color: true }),
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
      tableId: Type.String({ objectid: true, tableid: true }),
      query: Type.Object({}, {
        query: true,
        disable: (value: unknown, parent: AnyData) => (
          parent.tableId ? false : 'Please select a table first'
        ),
      }),
      hideFilter: Type.Boolean(),
    }),
  ], false),
  defaultValues: {
    separator: 'horizontal',
    selection: 'none',
    virtualScrollSliceSize: 30,
    virtualScrollSliceRatioBefore: 1,
    virtualScrollSliceRatioAfter: 1,
    virtualScrollItemSize: 48,
    hideFilter: true,
    columns: [
      {
        name: 'name',
        label: 'Name',
        field: 'name',
        align: 'left',
      },
      {
        name: 'age',
        label: 'Age',
        field: 'age',
        align: 'left',
      },
    ],
    visibleColumns: ['name', 'age'],
    rows: [
      { name: 'Alain', age: 49 },
    ],
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'title',
        'rows',
        'rowKey',
        'columns',
        'visibleColumns',
        'tableId',
        'query',
        'selection',
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
  },
} as TFormComponent

import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, tableIcon } from '../icons'
import ExType from '../extypes'

export const tabSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    label: Type.Optional(Type.String()),
    icon: Type.Optional(Type.String()),
    color: Type.Optional(Type.String()),
    alert: Type.Optional(Type.String()),
    alertIcon: Type.Optional(Type.String()),
    noCaps: Type.Optional(Type.Boolean()),
    disable: Type.Optional(Type.Boolean()),
    badgeValue: Type.Optional(Type.String()),
    badgeColor: Type.Optional(Type.String()),
    _fields: Type.Array(Type.Object({}, { additionalProperties: true })),
  },
  { $id: 'FormTab', additionalProperties: true },
)

export const columnSchema = Type.Recursive((self) => Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    _type: Type.String(),
    size: Type.Optional(Type.Number()),
    _fields: Type.Array(Type.Object(
      {
        _id: ExType.Id(),
        name: Type.String(),
        _type: Type.String(),
        _columns: Type.Optional(Type.Array(self)),
      },
      { additionalProperties: true },
    )),
  },
  { $id: 'FormColumn', additionalProperties: true },
))

export const fieldSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    _type: Type.String(),
    _columns: Type.Optional(Type.Array(columnSchema)),
  },
  { $id: 'FormField', additionalProperties: true },
)

/**
 * Schema for visual table component editor column
 */
export const formTableColumnSchema = Type.Object({
  _id: ExType.Id(),
  name: Type.String(),
  label: Type.String(),
  field: ExType.Field({ tableProp: '../tableId' }),
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
}, {
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'field',
        'label',
        'align',
        'required',
        'sortable',
        'sortOrder',
      ],
    },
  },
  horizontalPopup: true,
})

export const formSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    data: Type.Optional(ExType.JSON()),
    hideFilter: Type.Optional(Type.Boolean({ skip: true })),
    grid: Type.Optional(Type.Boolean()),
    gridHeader: Type.Optional(Type.Boolean()),
    visibleColumns: Type.Optional(Type.Array(Type.String())),
    title: Type.Optional(Type.String()),
    hideHeader: Type.Optional(Type.Boolean()),
    hideBottom: Type.Optional(Type.Boolean()),
    hideSelectedBanner: Type.Optional(Type.Boolean()),
    hideNoData: Type.Optional(Type.Boolean()),
    hidePagination: Type.Optional(Type.Boolean()),
    separator: Type.Optional(StringEnum(['horizontal', 'vertical', 'cell', 'none'])),
    wrapCells: Type.Optional(Type.Boolean()),
    noDataLabel: Type.Optional(Type.String()),
    noResultsLabel: Type.Optional(Type.String()),
    loadingLabel: Type.Optional(Type.String()),
    filter: Type.Optional(Type.String()),
    rowsPerPageLabel: Type.Optional(Type.String()),
    rowsPerPageOptions: Type.Optional(Type.Array(Type.Number())),
    selection: Type.Optional(StringEnum(['single', 'multiple', 'none'])),
    binaryStateSort: Type.Optional(Type.Boolean()),
    tableColspan: Type.Optional(Type.Number()),
    tableId: Type.Optional(ExType.Table()),
    hideTable: Type.Optional(Type.Boolean()),
    query: Type.Optional(ExType.Query()),
    _fields: Type.Array(fieldSchema),
  },
  {
    $id: 'Form',
    additionalProperties: true,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
        ],
      },
      table: {
        icon: tableIcon,
        names: [
          'tableId',
          'hideTable',
          'query',
          'data',
          'title',
          'visibleColumns',
          'filter',
          'hideFilter',
          'grid',
          'gridHeader',
          'hideHeader',
          'hideBottom',
          'hideSelectedBanner',
          'hideNoData',
          'hidePagination',
          'separator',
          'wrapCells',
          'noDataLabel',
          'noResultsLabel',
          'loadingLabel',
          'rowsPerPageLabel',
          'rowsPerPageOptions',
          'selection',
          'binaryStateSort',
          'tableColspan',
        ],
      },
    },
    tableFields: [
      'tableId',
      'query',
      'title',
      'visibleColumns',
      'filter',
      'hideFilter',
      'grid',
      'gridHeader',
      'hideHeader',
      'hideBottom',
      'hideSelectedBanner',
      'hideNoData',
      'hidePagination',
      'separator',
      'wrapCells',
      'noDataLabel',
      'noResultsLabel',
      'loadingLabel',
      'rowsPerPageLabel',
      'rowsPerPageOptions',
      'selection',
      'binaryStateSort',
      'tableColspan',
    ],
  },
)

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    list: Type.Array(formSchema),
    // from resolvers
    formIds: Type.Optional(Type.Array(ExType.Id())),
    tableIds: Type.Optional(Type.Array(ExType.Id())),
  },
  { $id: 'FormList', additionalProperties: false },
)

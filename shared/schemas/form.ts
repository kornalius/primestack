import { StringEnum, Type } from '@feathersjs/typebox'
import { tableIcon } from '../icons'
import { AnyData } from '../interfaces/commons'

export const columnSchema = Type.Recursive((self) => Type.Object(
  {
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    _type: Type.String(),
    size: Type.Optional(Type.Number()),
    _fields: Type.Array(Type.Object(
      {
        _id: Type.String({ objectid: true }),
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
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    _type: Type.String(),
    _columns: Type.Optional(Type.Array(columnSchema)),
  },
  { $id: 'FormField', additionalProperties: true },
)

export const formSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    data: Type.Optional(Type.Object({}, { json: true })),
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
    tableId: Type.Optional(Type.String({ objectid: true, tableid: true })),
    hideTable: Type.Optional(Type.Boolean()),
    query: Type.Optional(Type.Object({}, {
      query: true,
      disable: (value: unknown, parent: AnyData) => (
        parent.tableId ? false : 'Please select a table first'
      ),
    })),
    _fields: Type.Array(fieldSchema),
  },
  {
    $id: 'Form',
    additionalProperties: true,
    categories: {
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
    _id: Type.String({ objectid: true }),
    list: Type.Array(formSchema),
  },
  { $id: 'FormList', additionalProperties: false },
)

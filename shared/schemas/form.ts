import { StringEnum, Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, styleIcon, tableIcon,
} from '../icons'
import ExType from '../extypes'
import { keyboardEvent } from '../action'
import { AnyData } from '../interfaces/commons'
import { supportedFieldTypes, supportedStringFormats, lookupSchema } from './table'

export const formTabSchema = Type.Object(
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
  type: StringEnum(supportedFieldTypes),
  slider: Type.Optional(Type.Boolean()),
  format: Type.Optional(StringEnum(supportedStringFormats)),
  multipleOf: Type.Optional(Type.Number()),
  min: Type.Optional(Type.Number()),
  exclusiveMin: Type.Optional(Type.Number()),
  max: Type.Optional(Type.Number()),
  exclusiveMax: Type.Optional(Type.Number()),
  dateMin: Type.Optional(Type.String()),
  dateExclusiveMin: Type.Optional(Type.String()),
  dateMax: Type.Optional(Type.String()),
  dateExclusiveMax: Type.Optional(Type.String()),
  pattern: Type.Optional(Type.String()),
  options: Type.Optional(Type.Array(
    Type.Object({
      label: Type.String(),
      value: Type.String(),
    }, { horizontal: true, horizontalPopup: true }),
  )),
  multiple: Type.Optional(Type.Boolean()),
  toggles: Type.Optional(Type.Boolean()),
  chip: Type.Optional(Type.Boolean()),
  color: Type.Optional(ExType.Color({ quasarPalette: true })),
  rating: Type.Optional(Type.Boolean()),
  ratingIcon: Type.Optional(ExType.Icon()),
  ratingIconFilled: Type.Optional(ExType.Icon()),
  ratingIconHalf: Type.Optional(ExType.Icon()),
  service: Type.Optional(ExType.Table()),
  query: Type.Optional(ExType.Query({ tableProp: 'service' })),
  columns: Type.Optional(Type.Array(lookupSchema)),
  valueField: Type.Optional(ExType.Field({ tableProp: 'service' })),
  labelField: Type.Optional(ExType.Field({ tableProp: 'service' })),
}, {
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'field',
        'label',
        'align',
        'required',
        'sortable',
        'sortOrder',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'type',
        'chip',
        'color',
        'pattern',
        { name: 'options', label: 'Items' },
        {
          label: 'Options',
          children: [
            { name: 'multiple', label: 'Multiple' },
            { name: 'toggles', label: 'Toggles' },
          ],
        },
        {
          label: 'Numeric',
          children: [
            { name: 'slider', label: 'Slider' },
            { name: 'multipleOf', label: 'Multiple of' },
            { name: 'min', label: 'Minimum' },
            { name: 'exclusiveMin', label: 'Exclusive Minimum' },
            { name: 'max', label: 'Maximum' },
            { name: 'exclusiveMax', label: 'Exclusive Maximum' },
          ],
        },
        {
          label: 'Rating',
          children: [
            { name: 'ratingIcon', label: 'Icon' },
            { name: 'ratingIconFilled', label: 'Filled Icon' },
            { name: 'ratingIconHalf', label: 'Half Icon' },
          ],
        },
        {
          label: 'Date',
          children: [
            { name: 'dateMin', label: 'Minimum date' },
            { name: 'dateExclusiveMin', label: 'Minimum exclusive date' },
            { name: 'dateMax', label: 'Maximum date' },
            { name: 'dateExclusiveMax', label: 'Maximum exlusive date' },
          ],
        },
        { name: 'columns', label: 'Lookup columns' },
        {
          label: 'Lookup',
          children: [
            { name: 'service', label: 'Service' },
            { name: 'query', label: 'Query' },
            { name: 'valueField', label: 'Value Field' },
            { name: 'labelField', label: 'Label Field' },
          ],
        },
      ],
    },
  },
  horizontalPopup: true,
})

export const formSchema = Type.Object(
  {
    _id: ExType.Id(),
    _fields: Type.Array(fieldSchema),
    name: Type.String(),
    data: Type.Optional(ExType.JSON()),
    hideFilter: Type.Optional(Type.Boolean({ skip: true })),
    grid: Type.Optional(Type.Boolean()),
    gridHeader: Type.Optional(Type.Boolean()),
    visibleColumns: Type.Optional(ExType.MultiField()),
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
    mounted: Type.Optional(ExType.Action()),
    updated: Type.Optional(ExType.Action()),
    unmounted: Type.Optional(ExType.Action()),
    keydown: Type.Optional(ExType.Action()),
    keyup: Type.Optional(ExType.Action()),
    tableCreate: Type.Optional(ExType.Action()),
    tablePatch: Type.Optional(ExType.Action()),
    tableRemove: Type.Optional(ExType.Action()),
  },
  {
    $id: 'Form',
    additionalProperties: true,
    categories: {
      table: {
        icon: tableIcon,
        names: [
          { name: 'tableId', label: 'Table' },
          'hideTable',
          'query',
          'data',
          'title',
          'visibleColumns',
          'filter',
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
          {
            label: 'Hide',
            sectionColor: 'purple-1',
            children: [
              { name: 'hideFilter', label: 'Filter' },
              { name: 'hideHeader', label: 'Header' },
              { name: 'hideBottom', label: 'Bottom' },
              { name: 'hideSelectedBanner', label: 'Selected banner' },
              { name: 'hideNoData', label: 'No data' },
              { name: 'hidePagination', label: 'Pagination' },
            ],
          },
          'grid',
          'gridHeader',
          'separator',
          'wrapCells',
          'rowsPerPageOptions',
          'selection',
          'binaryStateSort',
          'tableColspan',
        ],
      },
      action: {
        icon: actionIcon,
        names: [
          'mounted',
          'updated',
          'unmounted',
          'keydown',
          'keyup',
          'tableCreate',
          'tablePatch',
          'tableRemove',
        ],
      },
    },
    // fields to bind to schema-table in form
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
    defaultValues: {
      rowsPerPageOptions: [10, 25, 50, 100],
    },
    eventArgs: {
      mounted: () => ({}),
      updated: () => ({}),
      unmounted: () => ({}),
      tableCreate: (doc: AnyData) => ({ value: doc }),
      tablePatch: (doc: AnyData) => ({ value: doc }),
      tableRemove: (doc: AnyData) => ({ value: doc }),
      keydown: keyboardEvent,
      keyup: keyboardEvent,
    },
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

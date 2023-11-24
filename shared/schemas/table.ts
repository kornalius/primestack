import { Type, StringEnum } from '@feathersjs/typebox'
import { contentIcon, modelIcon } from '../icons'
import ExType from '../extypes'
import { flexSizeString } from '../interfaces/commons'

export const supportedFieldTypes = [
  'string',
  'number',
  'boolean',
  'color',
  'icon',
  'date',
  'time',
  'objectid',
  'object',
]

export const supportedStringFormats = [
  'date-time',
  'date',
  'time',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uri-template',
  'uuid',
  'json-pointer',
  'relative-json-pointer',
  'regex',
  'duration',
  'byte',
  'int32',
  'int64',
  'float',
  'double',
  'password',
  'binary',
]

export const supportedMethods = [
  'get',
  'find',
  'create',
  'patch',
  'remove',
]

export const transformNames = [
  'lowerCase',
  'upperCase',
  'capitalize',
  'kebabCase',
  'snakeCase',
  'startCase',
  'cleanup',
  'escape',
  'unescape',
  'truncate',
  'discard',
  'deburr',
  'trim',
  'trimLeft',
  'trimRight',
  'min',
  'max',
  'ceil',
  'floor',
  'round',
  'random',
]

export const lookupSchema = Type.Object({
  field: ExType.Field(),
  col: Type.Optional(flexSizeString()),
  filterable: Type.Optional(Type.Boolean()),
  class: Type.Optional(Type.String()),
  style: Type.Optional(Type.String()),
  title: Type.Optional(Type.String()),
  titleClass: Type.Optional(Type.String()),
  titleStyle: Type.Optional(Type.String()),
})

export const tableFieldSchema = Type.Object(
  {
    _id: ExType.Id(),
    _internalType: Type.String(),
    name: Type.String(),
    type: StringEnum(supportedFieldTypes),
    hidden: Type.Optional(Type.Boolean()),
    array: Type.Optional(Type.Boolean()),
    optional: Type.Optional(Type.Boolean()),
    readonly: Type.Optional(Type.Boolean()),
    queryable: Type.Optional(Type.Boolean()),
    secret: Type.Optional(Type.Boolean()),
    transforms: Type.Optional(Type.Array(
      Type.Object({
        type: StringEnum(transformNames),
        value: Type.Optional(Type.Number()),
        disable: Type.Optional(Type.Boolean()),
      }, { horizontal: true, horizontalPopup: true }),
    )),
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
    refTableId: Type.Optional(ExType.Table()),
    refFields: Type.Optional(Type.Array(
      ExType.Field({ select: true, tableProp: '../refTableId' }),
    )),
  },
  {
    $id: 'TableField',
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
          'type',
          { name: 'refTableId', label: 'Reference Table' },
          { name: 'refFields', label: 'Reference Fields' },
          'optional',
          'queryable',
          'array',
          'readonly',
          'secret',
        ],
      },
      model: {
        icon: modelIcon,
        names: [
          'transforms',
          'format',
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
  },
)

export const tableIndexSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    fields: Type.Array(Type.Object({
      field: ExType.Field({ tableProp: '../../_id'}),
      descending: Type.Boolean(),
    }, { horizontal: true })),
    unique: Type.Boolean(),
    sparse: Type.Boolean(),
  },
  {
    $id: 'TableIndex',
    additionalProperties: false,
    categories: {
      content: {
        names: [
          'name',
          'fields',
          'unique',
          'sparse',
        ],
      },
    },
  },
)

export const tableSchema = Type.Object(
  {
    _id: ExType.Id(),
    _internalType: Type.String(),
    path: Type.String(),
    name: Type.String(),
    methods: Type.Array(StringEnum(supportedMethods)),
    created: Type.Boolean(),
    updated: Type.Boolean(),
    softDelete: Type.Boolean(),
    userRead: Type.Boolean(),
    userWrite: Type.Boolean(),
    fields: Type.Array(tableFieldSchema),
    indexes: Type.Array(tableIndexSchema, { fixed: true }),
    // when specified (events, files), the data will come from those services instead
    service: Type.Optional(StringEnum(['events', 'files'])),
    shareId: Type.Optional(ExType.Id()),
  },
  {
    $id: 'Table',
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'methods',
          'softDelete',
          'indexes',
        ],
      },
    },
  },
)

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    userId: Type.Optional(ExType.Id()),
    list: Type.Array(tableSchema),
  },
  { $id: 'TableList', additionalProperties: false },
)

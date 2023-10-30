import { Type, StringEnum } from '@feathersjs/typebox'
import { contentIcon, modelIcon } from '../icons'
import ExType from '../extypes'

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

export const tableFieldSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: Type.String(),
    type: StringEnum(supportedFieldTypes),
    hidden: Type.Boolean(),
    array: Type.Boolean(),
    optional: Type.Boolean(),
    readonly: Type.Boolean(),
    queryable: Type.Boolean(),
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
      }),
    )),
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
          'type',
          { name: 'refTableId', label: 'Reference Table' },
          { name: 'refFields', label: 'Reference Fields' },
          'optional',
          'queryable',
          'array',
          'readonly',
        ],
      },
      model: {
        icon: modelIcon,
        names: [
          'format',
          'options',
          'slider',
          'multipleOf',
          'min',
          'exclusiveMin',
          'max',
          'exclusiveMax',
          'dateMin',
          'dateExclusiveMin',
          'dateMax',
          'dateExclusiveMax',
          'pattern',
        ],
      },
    },
  },
)

export const tableIndexSchema = Type.Object(
  {
    _id: ExType.Id(),
    name: ExType.Field(),
    order: Type.Number({ minimum: -1, maximum: 1 }),
    unique: Type.Boolean(),
    sparse: Type.Boolean(),
  },
  {
    $id: 'TableIndex',
    horizontal: true,
    horizontalPopup: true,
    additionalProperties: false,
    categories: {
      content: {
        names: [
          'order',
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
    name: Type.String(),
    methods: Type.Array(StringEnum(supportedMethods)),
    created: Type.Boolean(),
    updated: Type.Boolean(),
    softDelete: Type.Boolean(),
    user: Type.Boolean(),
    fields: Type.Array(tableFieldSchema),
    indexes: Type.Array(tableIndexSchema),
    // when specified (events, files), the data will come from those services instead
    service: Type.Optional(StringEnum(['events', 'files'])),
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
    // from resolvers
    tableIds: Type.Optional(Type.Array(ExType.Id())),
  },
  { $id: 'TableList', additionalProperties: false },
)

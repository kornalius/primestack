import { Type, StringEnum } from '@feathersjs/typebox'
import { contentIcon, modelIcon } from '../icons'

export const supportedFieldTypes = [
  'string',
  'number',
  'boolean',
  'color',
  'icon',
  'objectid',
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
    _id: Type.String({ objectid: true }),
    name: Type.String({ availableFieldname: true }),
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
      })
    )),
  },
  {
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
          'type',
          'queryable',
          'slider',
          'options',
        ],
      },
      model: {
        icon: modelIcon,
        names: [
          'format',
          'array',
          'optional',
          'readonly',
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
    _id: Type.String({ objectid: true }),
    name: Type.String({ availableFieldname: true }),
    order: Type.Number({ minimum: -1, maximum: 1 }),
    unique: Type.Boolean(),
    sparse: Type.Boolean(),
  },
  {
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
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
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    methods: Type.Array(StringEnum(supportedMethods)),
    created: Type.Boolean(),
    updated: Type.Boolean(),
    softDelete: Type.Boolean(),
    user: Type.Boolean(),
    fields: Type.Array(tableFieldSchema),
    indexes: Type.Array(tableIndexSchema),
  },
  {
    additionalProperties: false,
    categories: {
      content: {
        icon: contentIcon,
        names: [
          'name',
          'methods',
          'created',
          'updated',
          'softDelete',
          'user',
        ],
      },
    },
  },
)

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    userId: Type.Optional(Type.String({ objectid: true })),
    list: Type.Array(tableSchema),
  },
  { $id: 'Table', additionalProperties: false },
)
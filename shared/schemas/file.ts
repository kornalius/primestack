import { Type } from '@feathersjs/typebox'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    tableId: Type.String({ objectid: true }),
    docId: Type.String({ objectid: true }),
    originalFilename: Type.String(),
    newFilename: Type.String(),
    filepath: Type.String(),
    mimetype: Type.String(),
    size: Type.Integer(),
    state: Type.Optional(Type.Integer()),
    progress: Type.Optional(Type.Integer()),
    error: Type.Optional(Type.String()),
    data: Type.Optional(Type.String()),
  }),
], { $id: 'File', additionalProperties: false })

// for special user tables
export const fileFields = [
  {
    name: 'originalFilename',
    type: 'string',
    hidden: false,
    optional: false,
    array: false,
    readonly: true,
    queryable: true,
  },
  {
    name: 'mimetype',
    type: 'string',
    hidden: false,
    optional: false,
    array: false,
    readonly: true,
    queryable: true,
  },
  {
    name: 'size',
    type: 'number',
    hidden: false,
    optional: false,
    array: false,
    readonly: true,
    queryable: true,
  },
  {
    name: 'tableId',
    type: 'objectid',
    hidden: false,
    optional: false,
    array: false,
    readonly: true,
    queryable: true,
  },
  {
    name: 'docId',
    type: 'objectid',
    hidden: false,
    optional: false,
    array: false,
    readonly: true,
    queryable: true,
  },
]

export const fileTable = {
  service: 'files',
  methods: ['get', 'find', 'remove'],
  created: true,
  updated: true,
  softDelete: false,
  user: false,
  fields: fileFields,
  indexes: [],
}

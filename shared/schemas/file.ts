import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const schema = Type.Intersect([
  Type.Object({
    _id: ExType.Id(),
    tableId: ExType.Id(),
    docId: ExType.Id(),
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
    readonly: true,
    queryable: true,
  },
  {
    name: 'mimetype',
    type: 'string',
    readonly: true,
    queryable: true,
  },
  {
    name: 'size',
    type: 'number',
    readonly: true,
    queryable: true,
  },
  {
    name: 'tableId',
    type: 'objectid',
    readonly: true,
    queryable: true,
  },
  {
    name: 'docId',
    type: 'objectid',
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
  userRead: false,
  userWrite: true,
  fields: fileFields,
  indexes: [],
}

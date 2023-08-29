import { Type } from '@feathersjs/typebox'

export const schema = Type.Object({
  tableId: Type.Optional(Type.String({ objectid: true, tableid: true })),
  read: Type.Boolean(),
  create: Type.Boolean(),
  update: Type.Boolean(),
  delete: Type.Boolean(),
}, { $id: 'Rule', additionalProperties: false })

export const maxSchema = Type.Object({
  maxShares: Type.Integer(),
  maxTables: Type.Integer(),
  maxRecords: Type.Integer(),
  maxFiles: Type.Integer(),
  maxFileSize: Type.Integer(),
}, { $id: 'Max', additionalProperties: false })

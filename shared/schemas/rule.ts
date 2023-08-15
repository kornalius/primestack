import { Type } from '@feathersjs/typebox'

export const ruleSchema = Type.Object({
  tableId: Type.Optional(Type.String({ objectid: true, tableid: true })),
  read: Type.Boolean(),
  create: Type.Boolean(),
  update: Type.Boolean(),
  delete: Type.Boolean(),
}, { $id: 'Rule', additionalProperties: false })

export const schema = Type.Object({
  maxShares: Type.Integer(),
  maxTables: Type.Integer(),
  maxRecords: Type.Integer(),
  maxFiles: Type.Integer(),
  maxFileSize: Type.Integer(),
}, { $id: 'Rule', additionalProperties: false })

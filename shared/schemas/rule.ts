import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const schema = Type.Object({
  tableId: Type.Optional(ExType.Table()),
  read: Type.Boolean(),
  create: Type.Boolean(),
  update: Type.Boolean(),
  delete: Type.Boolean(),
}, { $id: 'Rule', additionalProperties: false })

export const maxSchema = Type.Object({
  maxShares: Type.Integer(),
  maxTables: Type.Integer(),
  maxRecords: Type.Integer(),
  maxMenus: Type.Integer(),
  maxForms: Type.Integer(),
  maxEdits: Type.Integer(),
  maxFiles: Type.Integer(),
  maxFileSize: Type.Integer(),
  maxSettings: Type.Integer(),
}, { $id: 'Max', additionalProperties: false })

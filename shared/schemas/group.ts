import { Type } from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    description: Type.String(),
    maxShares: Type.Integer(),
    maxTables: Type.Integer(),
    maxRecords: Type.Integer(),
    maxFiles: Type.Integer(),
    maxFileSize: Type.Integer(),
    read: Type.Array(Type.String()),
    create: Type.Array(Type.String()),
    update: Type.Array(Type.String()),
    delete: Type.Array(Type.String()),
  },
  { $id: 'Group', additionalProperties: false },
)

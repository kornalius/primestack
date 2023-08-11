import { Type } from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    description: Type.String(),
    color: Type.Optional(Type.String()),
    bestValue: Type.Optional(Type.Boolean()),
    price: Type.Number(),
    items: Type.Array(Type.String()),
    maxShares: Type.Integer(),
    maxTables: Type.Integer(),
    maxRecords: Type.Integer(),
    maxFiles: Type.Integer(),
    maxFileSize: Type.Integer(),
  },
  { $id: 'Plan', additionalProperties: false },
)

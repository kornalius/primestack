import { Type } from '@feathersjs/typebox'
import { schema as maxSchema } from './rule'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    description: Type.String(),
    color: Type.Optional(Type.String()),
    bestValue: Type.Optional(Type.Boolean()),
    price: Type.Number(),
    items: Type.Array(Type.String()),
  }),
  maxSchema,
], { $id: 'Plan', additionalProperties: false })

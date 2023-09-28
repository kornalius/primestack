import { Type } from '@feathersjs/typebox'
import { maxSchema } from './rule'
import ExType from '../extypes'

export const schema = Type.Intersect([
  Type.Object({
    _id: ExType.Id(),
    code: Type.String(),
    name: Type.String(),
    description: Type.String(),
    color: Type.Optional(Type.String()),
    bestValue: Type.Optional(Type.Boolean()),
    price: Type.Number(),
    items: Type.Array(Type.String()),
  }),
  maxSchema,
], { $id: 'Plan', additionalProperties: false })

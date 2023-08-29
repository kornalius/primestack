import { Type } from '@feathersjs/typebox'
import { maxSchema, schema as ruleSchema } from './rule'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    description: Type.String(),
    planId: Type.String({ objectid: true }),
    rules: Type.Array(ruleSchema),
  }),
  maxSchema,
], { $id: 'Group', additionalProperties: false })

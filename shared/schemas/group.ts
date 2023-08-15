import { Type } from '@feathersjs/typebox'
import { schema as maxSchema, ruleSchema } from './rule'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    name: Type.String(),
    description: Type.String(),
    rules: Type.Array(ruleSchema),
  }),
  maxSchema,
], { $id: 'Group', additionalProperties: false })

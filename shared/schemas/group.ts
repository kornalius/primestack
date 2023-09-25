import { Type } from '@feathersjs/typebox'
import { maxSchema, schema as ruleSchema } from './rule'
import ExType from '../extypes'

export const schema = Type.Intersect([
  Type.Object({
    _id: ExType.Id(),
    name: Type.String(),
    description: Type.String(),
    planId: ExType.Id(),
    rules: Type.Array(ruleSchema),
  }),
  maxSchema,
], { $id: 'Group', additionalProperties: false })

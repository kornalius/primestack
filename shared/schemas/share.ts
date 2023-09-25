import { Type } from '@feathersjs/typebox'
import { schema as ruleSchema } from './rule'
import ExType from '../extypes'

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    // target userId
    userId: ExType.Id(),
    // target email if not registered
    email: Type.String({ email: true }),
    // menuId to share
    menuId: ExType.Id(),
    rules: Type.Array(ruleSchema),
    disabled: Type.Boolean(),
    validFrom: Type.Optional(ExType.Date()),
    validUntil: Type.Optional(ExType.Time()),
    // from resolvers
    formIds: Type.Optional(Type.Array(ExType.Id())),
    tableIds: Type.Optional(Type.Array(ExType.Id())),
  },
  { $id: 'Share', additionalProperties: false },
)

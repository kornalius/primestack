import { Type } from '@feathersjs/typebox'
import { schema as ruleSchema } from './rule'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    // target userId
    userId: Type.String({ objectid: true }),
    // target email if not registered
    email: Type.String({ email: true }),
    // menuId to share
    menuId: Type.String({ objectid: true }),
    rules: Type.Array(ruleSchema),
    disabled: Type.Boolean(),
    validFrom: Type.Optional(Type.String({ date: true })),
    validUntil: Type.Optional(Type.String({ date: true })),
    formIds: Type.Optional(Type.Array(Type.String())),
    tableIds: Type.Optional(Type.Array(Type.String())),
  },
  { $id: 'Share', additionalProperties: false },
)

import { Type } from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    // target userId
    userid: Type.String({ objectid: true }),
    // target email if not registered
    email: Type.String({ email: true }),
    // menuId to share
    menuid: Type.String({ objectid: true }),
    read: Type.Boolean(),
    create: Type.Boolean(),
    update: Type.Boolean(),
    delete: Type.Boolean(),
    disabled: Type.Boolean(),
    validFrom: Type.Optional(Type.String({ date: true })),
    validUntil: Type.Optional(Type.String({ date: true })),
  },
  { $id: 'Share', additionalProperties: false },
)

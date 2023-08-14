import { Type } from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    // target userId
    userid: Type.String({ objectid: true }),
    // menuId to share
    menuid: Type.String({ objectid: true }),
    read: Type.Boolean(),
    create: Type.Boolean(),
    update: Type.Boolean(),
    delete: Type.Boolean(),
    disabled: Type.Boolean(),
    validUntil: Type.Optional(Type.String({ date: true })),
  },
  { $id: 'Share', additionalProperties: false },
)

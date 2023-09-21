import { Type } from '@feathersjs/typebox'

export const actionElementSchema = Type.Recursive((self) => Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _type: Type.String(),
    _children: Type.Array(self)
  }
, { $id: 'ActionElement' }))

export const actionSchema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    _actions: Type.Array(actionElementSchema)
  }
  , { $id: 'Action' })

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    list: Type.Array(actionSchema),
    actionIds: Type.Optional(Type.Array(Type.String())),
  },
  { $id: 'ActionList', additionalProperties: false },
)

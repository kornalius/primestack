import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const actionElementSchema = Type.Recursive((self) => (
  Type.Object({
    _id: ExType.Id(),
    _type: Type.String(),
    _children: Type.Array(self),
  }, { $id: 'ActionElement' })
))

export const actionSchema = Type.Object({
  _id: ExType.Id(),
  _actions: Type.Array(actionElementSchema),
  shareId: Type.Optional(ExType.Id()),
}, { $id: 'Action' })

export const schema = Type.Object({
  _id: ExType.Id(),
  list: Type.Array(actionSchema),
  actionIds: Type.Optional(Type.Array(Type.String())),
}, { $id: 'ActionList', additionalProperties: false })

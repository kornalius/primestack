import { Type } from '@feathersjs/typebox'
import ExType from '../extypes'

export const blueprintSchema = Type.Object({
  _id: ExType.Id(),
  name: Type.String(),
  description: Type.Optional(Type.String()),
  menuId: Type.Optional(ExType.Id()),
  properties: Type.Object({}, { additionalProperties: true }),
  componentType: Type.String(),
}, { $id: 'Blueprint' })

export const schema = Type.Object({
  _id: ExType.Id(),
  list: Type.Array(blueprintSchema),
}, { $id: 'BlueprintList', additionalProperties: false })

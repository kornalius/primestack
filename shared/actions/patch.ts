import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export const fieldSchema = Type.Object({
  name: Type.String({ field: true }),
  value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
}, { additionalProperties: false, horizontal: true, horizontalPopup: true })

export default {
  type: 'patch',
  label: 'actions.patch.label',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    id: Type.Optional(ExType.Id()),
    query: Type.Optional(ExType.Query()),
    fields: Type.Array(fieldSchema),
  }),
} as TAction

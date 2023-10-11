import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export const fieldSchema = Type.Object({
  name: Type.String({ field: true }),
  value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
}, { additionalProperties: false, horizontal: true, horizontalPopup: true })

export default {
  type: 'insert',
  label: 'Insert',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    fields: Type.Array(fieldSchema),
  }),
} as TAction

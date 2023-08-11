import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'

export const fieldSchema = Type.Object({
  name: Type.String(),
  value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
}, { additionalProperties: false, horizontal: true, horizontalPopup: true })

export default {
  type: 'insert',
  label: 'Insert',
  description: 'Inserts a new record into a table',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    fields: Type.Array(fieldSchema),
  }),
} as TAction

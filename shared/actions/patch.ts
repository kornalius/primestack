import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import { AnyData } from '../interfaces/commons'

export const fieldSchema = Type.Object({
  name: Type.String({ field: true }),
  value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
}, { additionalProperties: false, horizontal: true, horizontalPopup: true })

export default {
  type: 'patch',
  label: 'Patch',
  description: 'Patch a single or multiple records in a table',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    id: Type.Optional(Type.String({ objectid: true })),
    query: Type.Optional(Type.Object({}, {
      query: true,
      disable: (value: unknown, parent: AnyData) => (
        parent.tableId ? false : 'Please select a table first'
      ),
    })),
    fields: Type.Array(fieldSchema),
  }),
} as TAction

import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import { AnyData } from '../interfaces/commons'

export default {
  type: 'patch',
  label: 'Patch',
  description: 'Patch records in a table',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    query: Type.Optional(Type.Object({}, {
      query: true,
      disable: (value: unknown, parent: AnyData) => (
        parent.tableId ? false : 'Please select a table first'
      ),
    })),
    fields: Type.Optional(Type.Array(Type.Object({
      name: Type.String(),
      value: Type.Union([Type.String(), Type.Number(), Type.Boolean()]),
    }, { additionalProperties: false }))),
  }),
} as TAction

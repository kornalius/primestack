import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import { AnyData } from '../interfaces/commons'

export default {
  type: 'remove',
  label: 'Remove',
  description: 'Remove records from a table',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    query: Type.Optional(Type.Object({}, {
      query: true,
      disable: (value: unknown, parent: AnyData) => (
        parent.tableId ? false : 'Please select a table first'
      ),
    })),
  }),
} as TAction

import { Type } from '@feathersjs/typebox'
import { AnyData } from '../../interfaces/commons'

export default Type.Object({
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
})

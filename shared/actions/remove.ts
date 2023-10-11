import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'remove',
  label: 'Remove',
  schema: Type.Object({
    tableId: Type.String({ objectid: true, tableid: true }),
    query: Type.Optional(ExType.Query()),
  }),
} as TAction

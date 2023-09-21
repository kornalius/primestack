import { virtual } from '@feathersjs/schema'
import { Static } from '@feathersjs/typebox'
import { schema, tableSchema } from '@/shared/schemas/table'

type TableSchema = Static<typeof schema>
type Table = Static<typeof tableSchema>

// return a list of form ids in the list
const tableIds = virtual(async (value: TableSchema) => (
  value?.list.map((t: Table) => t._id.toString())
))

export default {
  data: {
    tableIds,
  },
  result: {
    tableIds,
  },
}

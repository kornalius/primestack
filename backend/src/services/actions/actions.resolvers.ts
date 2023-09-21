import { virtual } from '@feathersjs/schema'
import { Static } from '@feathersjs/typebox'
import { actionSchema, schema } from '@/shared/schemas/actions'

type ActionSchema = Static<typeof schema>
type Action = Static<typeof actionSchema>

// return a list of action ids in the list
const actionIds = virtual(async (value: ActionSchema) => (
  value?.list.map((a: Action) => a._id.toString())
))

export default {
  data: {
    actionIds,
  },
  result: {
    actionIds,
  },
}

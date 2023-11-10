import { virtual } from '@feathersjs/schema'
import { Static } from '@feathersjs/typebox'
import { formSchema, schema } from '@/shared/schemas/form'

type FormList = Static<typeof schema>
type Form = Static<typeof formSchema>

// return a list of form ids in the list
const formIds = virtual(async (value: FormList) => (
  value?.list.map((f: Form) => f._id.toString())
))

// return a list of all the table ids used in the forms
const tableIds = virtual(async (value: FormList) => (
  value
    ? value.list
      .filter((f: Form) => f.tableId)
      .map((f: Form) => f.tableId?.toString())
    : []
))

export default {
  data: {
    formIds,
    tableIds,
  },
  result: {
    formIds,
    tableIds,
  },
}

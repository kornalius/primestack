import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalGetselected from '@/shared/actions/getselected'
import { tableFields } from '@/features/Tables/composites'
import { tableSchema } from '@/shared/schemas/table'
import Getselected from '../components/getselected.vue'

type Table = Static<typeof tableSchema>

export default {
  ...globalGetselected,
  icon: 'mdi-select-search',
  component: Getselected,
  hideTitle: true,
  description: 'actions.getselected.description',
  childrenMessage: 'actions.getselected.childrenMessage',
  exec: async (ctx) => (
    ctx.app.selection
  ),
  result: (ctx): string[] => {
    const table = ctx.editor.tables
      ?.find((s: Table) => s._id === ctx.app.tableId) as Table
    const fields = tableFields(
      table.fields,
      table.created,
      table.updated,
      table.softDelete,
    )
    return fields.map((f) => f.name)
  },
} as TFrontAction

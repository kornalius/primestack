import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalInsert from '@/shared/actions/insert'
import { tableSchema } from '@/shared/schemas/table'
import { tableFields } from '@/features/Tables/composites'
// eslint-disable-next-line import/no-cycle
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { useFeathersService } from '@/composites/feathers'
import { fieldsArrayToObject } from '../composites'
import Insert from '../components/insert.vue'

type Table = Static<typeof tableSchema>

export default {
  ...globalInsert,
  icon: 'mdi-database-plus',
  component: Insert,
  hideTitle: true,
  description: 'actions.insert.description',
  childrenMessage: 'actions.insert.childrenMessage',
  exec: async (ctx) => {
    const tableId = anyToString(getProp(ctx.tableId, ctx))
    const data = fieldsArrayToObject(ctx.fields as [], ctx)
    await ctx.useFeathersService(tableId as string).create(data)
  },
  result: (ctx): string[] => {
    const tableId = anyToString(getProp(ctx.tableId, ctx))
    const userTable = useFeathersService('tables')
      .findOneInStore({ query: {} })
    const table = userTable.value?.list.find((t: Table) => t._id === tableId)
    const fields = tableFields(
      table.fields,
      table.created,
      table.updated,
      table.softDelete,
    )
    return fields.map((f) => f.name)
  },
} as TFrontAction

import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'
// eslint-disable-next-line import/no-cycle
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
import { tableSchema } from '@/shared/schemas/table'
import { tableFields } from '@/features/Tables/composites'
// eslint-disable-next-line import/no-cycle
import { anyToString } from '@/composites/utilities'
import { getProp } from '@/features/Expression/composites'
import { useFeathersService } from '@/composites/feathers'
import { fieldsArrayToObject } from '../composites'
import Patch from '../components/patch.vue'

type Table = Static<typeof tableSchema>

export default {
  ...globalPatch,
  icon: 'mdi-database-edit',
  component: Patch,
  hideTitle: true,
  description: 'actions.patch.description',
  childrenMessage: 'actions.patch.childrenMessage',
  exec: async (ctx) => {
    const id = anyToString(getProp(ctx.id, ctx))
    const tableId = anyToString(getProp(ctx.tableId, ctx))
    const data = fieldsArrayToObject(ctx.fields as [], ctx)

    if (ctx.id) {
      await ctx.useFeathersService(tableId)
        .patch(id, data, {})
    } else {
      const table = await ctx.useFeathersService('tables').get(tableId)
      await ctx.useFeathersService(tableId)
        .patch(null, data, {
          query: queryToMongo(ctx.query as Query, table, ctx.$expr),
        })
    }
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

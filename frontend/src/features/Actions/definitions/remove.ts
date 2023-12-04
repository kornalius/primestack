// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalRemove from '@/shared/actions/remove'
// eslint-disable-next-line import/no-cycle
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
import { anyToString } from '@/composites/utilities'
import { getProp } from '@/features/Expression/composites'

export default {
  ...globalRemove,
  icon: 'mdi-database-minus',
  description: 'actions.remove.description',
  childrenMessage: 'actions.remove.childrenMessage',
  exec: async (ctx) => {
    const tableId = anyToString(getProp(ctx.tableId, ctx))
    const id = anyToString(getProp(ctx.id, ctx))
    if (id) {
      await ctx.useFeathersService(tableId).remove(id)
    } else {
      const query = getProp(ctx.query, ctx) as Query
      const table = await ctx.useFeathersService('tables').get(tableId)
      await ctx.useFeathersService(tableId)
        .remove(null, {
          query: queryToMongo(query, table, ctx.$expr),
        })
    }
  },
} as TFrontAction

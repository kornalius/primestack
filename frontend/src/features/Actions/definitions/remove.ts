import { TFrontAction } from '@/features/Actions/interface'
import globalRemove from '@/shared/actions/remove'
// eslint-disable-next-line import/no-cycle
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'

export default {
  ...globalRemove,
  icon: 'mdi-database-minus',
  color: 'red-5',
  description: 'actions.remove.description',
  childrenMessage: 'actions.remove.childrenMessage',
  exec: async (ctx) => {
    if (ctx.id) {
      await ctx.api.service(ctx.tableId as string)
        .remove(ctx.id as string)
    } else {
      const table = await ctx.api.service('tables').get(ctx.tableId as string)
      await ctx.api.service(ctx.tableId as string)
        .remove(null, { query: queryToMongo(ctx.query as Query, table, ctx.$expr) })
    }
  },
} as TFrontAction

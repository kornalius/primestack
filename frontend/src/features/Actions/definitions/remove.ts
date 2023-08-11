import { TFrontAction } from '@/features/Actions/interface'
import globalRemove from '@/shared/actions/remove'
import { useQuery } from '@/features/Query/composites'
import { QueryGroup } from '@/shared/interfaces/query'

export default {
  ...globalRemove,
  icon: 'mdi-database-minus',
  color: 'red-5',
  exec: async (ctx) => {
    const { queryToMongo } = useQuery()
    if (ctx.id) {
      await ctx.api.service(ctx.tableId as string)
        .remove(ctx.id as string)
    } else {
      await ctx.api.service(ctx.tableId as string)
        .remove(null, { query: queryToMongo(ctx.query as QueryGroup[]) })
    }
  },
} as TFrontAction

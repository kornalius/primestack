import { TFrontAction } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'
import { useQuery } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
// eslint-disable-next-line import/no-cycle
import { useActions } from '../composites'

export default {
  ...globalPatch,
  icon: 'mdi-database-edit',
  color: 'orange-8',
  exec: async (ctx) => {
    const { queryToMongo } = useQuery()
    const { fieldsArrayToObject } = useActions()

    if (ctx.id) {
      await ctx.api.service(ctx.tableId as string)
        .update(ctx.id as string, fieldsArrayToObject(ctx.fields as []), {})
    } else {
      const table = await ctx.api.service('tables').get(ctx.tableId as string)
      await ctx.api.service(ctx.tableId as string)
        .update(null, fieldsArrayToObject(ctx.fields as []), {
          query: queryToMongo(ctx.query as Query, table),
        })
    }
  },
} as TFrontAction

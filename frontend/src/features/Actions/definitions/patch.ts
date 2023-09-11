import { TFrontAction } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'
// eslint-disable-next-line import/no-cycle
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
// eslint-disable-next-line import/no-cycle
import { fieldsArrayToObject } from '../composites'
import Patch from '../components/patch.vue'

export default {
  ...globalPatch,
  icon: 'mdi-database-edit',
  color: 'orange-8',
  component: Patch,
  exec: async (ctx) => {
    const data = fieldsArrayToObject(ctx.fields as [], ctx)

    if (ctx.id) {
      await ctx.api.service(ctx.tableId as string)
        .update(ctx.id as string, data, {})
    } else {
      const table = await ctx.api.service('tables').get(ctx.tableId as string)
      await ctx.api.service(ctx.tableId as string)
        .update(null, data, { query: queryToMongo(ctx.query as Query, table, ctx.$expr) })
    }
  },
} as TFrontAction

import { Static } from '@feathersjs/typebox'
import { TFrontAction, TFrontActionExecOptions } from '@/features/Actions/interface'
import globalPatch from '@/shared/actions/patch'
// eslint-disable-next-line import/no-cycle
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
import { tableSchema } from '@/shared/schemas/table'
import { tableFields } from '@/features/Tables/composites'
// eslint-disable-next-line import/no-cycle
import { fieldsArrayToObject } from '../composites'
import Patch from '../components/patch.vue'

type Table = Static<typeof tableSchema>

export default {
  ...globalPatch,
  icon: 'mdi-database-edit',
  color: 'orange-8',
  component: Patch,
  description: 'actions.patch.description',
  childrenMessage: 'actions.patch.childrenMessage',
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
  result: (ctx: TFrontActionExecOptions): string[] => {
    const table = ctx.editor.tables
      ?.find((s: Table) => s._id === ctx.tableId) as Table
    const fields = tableFields(
      table.fields,
      table.created,
      table.updated,
      table.softDelete,
    )
    return fields.map((f) => f.name)
  },
} as TFrontAction

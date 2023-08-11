import { TFrontAction } from '@/features/Actions/interface'
import globalInsert from '@/shared/actions/insert'
// eslint-disable-next-line import/no-cycle
import useActions from '../composites'
import Insert from '../components/insert.vue'

export default {
  ...globalInsert,
  icon: 'mdi-database-plus',
  color: 'green-5',
  component: Insert,
  exec: async (ctx) => {
    const { fieldsArrayToObject } = useActions()

    await ctx.api.service(ctx.tableId as string)
      .create(fieldsArrayToObject(ctx.fields as []), {})
  },
} as TFrontAction

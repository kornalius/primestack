import { TFrontAction } from '@/features/Actions/interface'
import globalNavigate from '@/shared/actions/navigate'

export default {
  ...globalNavigate,
  icon: 'mdi-earth-arrow-right',
  color: 'blue-4',
  exec: async (ctx) => {
    await ctx.router.push(ctx.url as string)
  },
} as TFrontAction

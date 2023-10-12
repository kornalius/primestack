import { TFrontAction } from '@/features/Actions/interface'
import globalNavigate from '@/shared/actions/navigate'
import Navigate from '../components/navigate.vue'

export default {
  ...globalNavigate,
  icon: 'mdi-earth-arrow-right',
  component: Navigate,
  description: 'actions.navigate.description',
  childrenMessage: 'actions.navigate.childrenMessage',
  exec: async (ctx) => {
    if (ctx.menuId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.router.push((ctx.url as any).menuUrl(ctx.menuId as string, ctx.tabId as string))
      return
    }
    await ctx.router.push(ctx.href as string)
  },
} as TFrontAction

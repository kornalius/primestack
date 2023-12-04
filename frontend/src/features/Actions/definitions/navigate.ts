// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import globalNavigate from '@/shared/actions/navigate'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Navigate from '../components/navigate.vue'

export default {
  ...globalNavigate,
  icon: 'mdi-earth-arrow-right',
  component: Navigate,
  description: 'actions.navigate.description',
  childrenMessage: 'actions.navigate.childrenMessage',
  exec: async (ctx) => {
    const menuId = anyToString(getProp(ctx.menuId, ctx))
    const tabId = anyToString(getProp(ctx.tabId, ctx))
    if (menuId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await ctx.router.push((ctx.url as any).menuUrl(menuId, tabId))
      return
    }
    const href = anyToString(getProp(ctx.href, ctx))
    await ctx.router.push(href as string)
  },
} as TFrontAction

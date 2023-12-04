import uniq from 'lodash/uniq'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import { AnyData } from '@/shared/interfaces/commons'
import globalMerge from '@/shared/actions/merge'
import { deepKeys } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Merge from '../components/merge.vue'

export default {
  ...globalMerge,
  icon: 'mdi-merge',
  component: Merge,
  description: 'actions.merge.description',
  childrenMessage: 'actions.merge.childrenMessage',
  exec: async (ctx) => {
    const obj1 = getProp(ctx.object1, ctx)
    const obj2 = getProp(ctx.object2, ctx)
    return {
      ...(obj1 as AnyData),
      ...(obj2 as AnyData),
    }
  },
  result: (ctx): string[] => {
    const obj1 = getProp(ctx.object1, ctx)
    const obj2 = getProp(ctx.object2, ctx)
    return uniq([
      ...deepKeys(obj1),
      ...deepKeys(obj2),
    ])
  },
} as TFrontAction

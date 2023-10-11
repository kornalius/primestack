import uniq from 'lodash/uniq'
import { TFrontAction, TFrontActionExecOptions } from '@/features/Actions/interface'
import { AnyData } from '@/shared/interfaces/commons'
import globalMerge from '@/shared/actions/merge'
import { deepKeys } from '@/composites/utilities'
import Merge from '../components/merge.vue'

export default {
  ...globalMerge,
  icon: 'mdi-merge',
  component: Merge,
  description: 'actions.merge.description',
  childrenMessage: 'actions.merge.childrenMessage',
  exec: async (args) => ({
    ...(args.object1 as AnyData),
    ...(args.object2 as AnyData),
  }),
  result: (ctx: TFrontActionExecOptions): string[] => (uniq([
    ...deepKeys(ctx.object1), ...deepKeys(ctx.object2),
  ])),
} as TFrontAction

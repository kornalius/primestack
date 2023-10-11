import pick from 'lodash/pick'
import { TFrontAction, TFrontActionExecOptions } from '@/features/Actions/interface'
import { AnyData } from '@/shared/interfaces/commons'
import globalMerge from '@/shared/actions/extract'
import Extract from '../components/extract.vue'

export default {
  ...globalMerge,
  icon: 'mdi-target-variant',
  component: Extract,
  description: 'actions.extract.description',
  childrenMessage: 'actions.extract.childrenMessage',
  exec: async (args) => (pick(
    args.value as AnyData,
    args.fields as string[],
  )),
  result: (ctx: TFrontActionExecOptions): string[] => ctx.fields as string[],
} as TFrontAction

import pick from 'lodash/pick'
// eslint-disable-next-line import/no-cycle
import { TFrontAction } from '@/features/Actions/interface'
import { AnyData } from '@/shared/interfaces/commons'
import globalExtract from '@/shared/actions/extract'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import Extract from '../components/extract.vue'

export default {
  ...globalExtract,
  icon: 'mdi-target-variant',
  component: Extract,
  description: 'actions.extract.description',
  childrenMessage: 'actions.extract.childrenMessage',
  exec: async (ctx) => {
    const obj = getProp(ctx.value, ctx)
    return pick(
      obj as AnyData,
      ctx.fields as string[],
    )
  },
  result: (ctx): string[] => ctx.fields as string[],
} as TFrontAction

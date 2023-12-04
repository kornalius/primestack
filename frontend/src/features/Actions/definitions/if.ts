import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalIf from '@/shared/actions/if'
// eslint-disable-next-line import/no-cycle
import { runExpr } from '@/features/Expression/composites'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'
import If from '../components/if.vue'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalIf,
  icon: 'mdi-source-branch',
  color: 'purple-2',
  hideTitle: true,
  description: 'actions.if.description',
  childrenMessage: 'actions.if.childrenMessage',
  component: If,
  exec: async (ctx) => {
    const r = runExpr(ctx.expr as string, ctx.$expr)
    if (r) {
      // eslint-disable-next-line no-underscore-dangle
      await exec(ctx._children as ActionElement[], ctx)
    }
  },
  defaultValues: {
  },
} as TFrontAction

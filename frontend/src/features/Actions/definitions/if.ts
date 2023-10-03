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
  color: 'purple-3',
  description: 'actions.if.description',
  childrenMessage: 'actions.if.childrenMessage',
  component: If,
  exec: async (args) => {
    const r = runExpr(args.expr as string, args.$expr)
    if (r) {
      // eslint-disable-next-line no-underscore-dangle
      await exec(args._children as ActionElement[], args)
    }
  },
  defaultValues: {
  },
} as TFrontAction

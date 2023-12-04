import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalTimeout from '@/shared/actions/timeout'
import { anyToString } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalTimeout,
  icon: 'mdi-timer-check',
  description: 'actions.timeout.description',
  childrenMessage: 'actions.timeout.childrenMessage',
  exec: async (ctx) => {
    const milliseconds = getProp(ctx.milliseconds, ctx) as number
    const varName = anyToString(getProp(ctx.varName, ctx))
    const i = setTimeout(async () => {
      // eslint-disable-next-line no-underscore-dangle
      await exec(ctx._children as ActionElement[], ctx)
    }, milliseconds)
    if (varName) {
      ctx.variables.set(varName, i)
    }
  },
} as TFrontAction

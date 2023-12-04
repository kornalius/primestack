import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalInterval from '@/shared/actions/interval'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { anyToString } from '@/composites/utilities'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalInterval,
  icon: 'mdi-timer-sync',
  description: 'actions.interval.description',
  childrenMessage: 'actions.interval.childrenMessage',
  exec: async (ctx) => {
    const varName = anyToString(getProp(ctx.varName, ctx))
    const milliseconds = getProp(ctx.milliseconds, ctx) as number
    const i = setInterval(async () => {
      // eslint-disable-next-line no-underscore-dangle
      await exec(ctx._children as ActionElement[], ctx)
    }, milliseconds)
    if (varName) {
      ctx.variables.set(varName, i)
    }
  },
} as TFrontAction

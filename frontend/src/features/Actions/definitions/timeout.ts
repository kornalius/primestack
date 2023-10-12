import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalTimeout from '@/shared/actions/timeout'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalTimeout,
  icon: 'mdi-timer-check',
  description: 'actions.timeout.description',
  childrenMessage: 'actions.timeout.childrenMessage',
  exec: async (args) => {
    const i = setTimeout(async () => {
      // eslint-disable-next-line no-underscore-dangle
      await exec(args._children as ActionElement[], args)
    }, args.milliseconds as number)
    if (args.varName) {
      args.variables.set(args.varName as string, i)
    }
  },
} as TFrontAction

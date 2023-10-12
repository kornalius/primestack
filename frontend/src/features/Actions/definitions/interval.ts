import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import globalInterval from '@/shared/actions/interval'
import { TFrontAction } from '../interface'
// eslint-disable-next-line import/no-cycle
import { exec } from '../composites'

type ActionElement = Static<typeof actionElementSchema>

export default {
  ...globalInterval,
  icon: 'mdi-timer-sync',
  description: 'actions.interval.description',
  childrenMessage: 'actions.interval.childrenMessage',
  exec: async (args) => {
    const i = setInterval(async () => {
      // eslint-disable-next-line no-underscore-dangle
      await exec(args._children as ActionElement[], args)
    }, args.milliseconds as number)
    if (args.varName) {
      args.variables.set(args.varName as string, i)
    }
  },
} as TFrontAction

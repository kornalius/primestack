import { Static } from '@feathersjs/typebox'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { actionSchema } from '@/shared/schemas/actions'
import { isActionPaid } from '@/shared/plan'
import { flattenActions } from '@/shared/action'

type Action = Static<typeof actionSchema>

export const checkPaidActions = async (context: HookContext) => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { user } = context.params
  const { _plan } = user

  context.data.list.forEach((action: Action) => {
    // eslint-disable-next-line no-underscore-dangle
    const userActions = flattenActions(action._actions)
    userActions.forEach((a) => {
      // eslint-disable-next-line no-underscore-dangle
      if (isActionPaid(a._type, _plan.code)) {
        // eslint-disable-next-line no-underscore-dangle
        throw new Forbidden(`Action ${a._type} is a paid feature`)
      }
    })
  })

  return context
}

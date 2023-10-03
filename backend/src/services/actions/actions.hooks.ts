import i18next from 'i18next'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { flattenActions } from '@/shared/action'
import { isActionAvailable } from '@/shared/plan'
import { Static } from '@feathersjs/typebox'
import { actionSchema } from '@/shared/schemas/actions'

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
      if (!isActionAvailable(a._type, _plan.code)) {
        throw new Forbidden(i18next.t('paid_feature.action', {
          // eslint-disable-next-line no-underscore-dangle
          type: a._type,
          lng: user.lng || 'en',
        }))
      }
    })
  })

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkPaidActions,
    ],
    update: [
      checkPaidActions,
    ],
    patch: [
      checkPaidActions,
    ],
  },
}

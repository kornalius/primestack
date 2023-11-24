import i18next from 'i18next'
import { Forbidden } from '@feathersjs/errors'
import { HookContext } from '@/declarations'
import { flattenActions } from '@/shared/action'
import { isActionAvailable } from '@/shared/plan'
import { Static } from '@feathersjs/typebox'
import { actionSchema } from '@/shared/schemas/actions'
import { uniquePushInResult } from '@/shared/utils'
import { getSharedActions } from '@/shared-utils'

type Action = Static<typeof actionSchema>

/**
 * Checks if a paid action has been used without the proper rights
 */
export const checkPaidActions = () => async (context: HookContext) => {
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

/**
 * Populate list of actions with shared actions as well
 */
const populateSharedActions = () => async (context: HookContext): Promise<HookContext> => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  const sharedActions = await getSharedActions(context)
  if (context.result) {
    uniquePushInResult(context, sharedActions)
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkPaidActions(),
    ],
    update: [
      checkPaidActions(),
    ],
    patch: [
      checkPaidActions(),
    ],
  },
  after: {
    all: [
      populateSharedActions(),
    ],
  },
}

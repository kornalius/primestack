import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

/**
 * Checks to make sure user does not have more shares than is allowed
 */
export const checkMaxShares = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const user = context.params?.user
  const { count } = await context.app.service('shares').find({
    query: {
      createdBy: user._id,
      $limit: -1,
      $skip: 0,
    }
  })
  const m = context.params?.user?.rights?.maxes?.maxShares
  if (m !== -1 && count >= m) {
    throw new Forbidden(i18next.t('paid_feature.share', {
      shareCount: m,
      count: m,
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxShares(),
    ],
  },
}

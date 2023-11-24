import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { getSharedMenus } from '@/shared-utils'
import { uniquePushInResult } from '@/shared/utils'

/**
 * Checks to make sure user does not have more menus than is allowed
 */
const checkMaxMenus = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxMenus
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(i18next.t('paid_feature.menu', {
      menuCount: m,
      count: m,
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

/**
 * Populate list of menus with shared menus as well
 */
const populateSharedMenus = () => async (context: HookContext): Promise<HookContext> => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  const sharedMenus = await getSharedMenus(context)
  if (context.result) {
    uniquePushInResult(context, sharedMenus)
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxMenus(),
    ],
    update: [
      checkMaxMenus(),
    ],
    patch: [
      checkMaxMenus(),
    ],
  },
  after: {
    all: [
      populateSharedMenus(),
    ],
  },
}

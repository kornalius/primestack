import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { uniquePushInResult } from '@/shared/utils'
import { checkPaidComponents } from '@/hooks/check-paid-components'
import { getSharedForms } from '@/shared-utils'

/**
 * Checks if the user does not have more forms than allowed
 */
const checkMaxForms = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxForms
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(i18next.t('paid_feature.form', {
      formCount: m,
      count: m,
      lng: context.params?.user?.lng as string || 'en',
    }))
  }
  return context
}

/**
 * Populate list of forms with shared forms as well
 */
const populateSharedForms = () => async (context: HookContext): Promise<HookContext> => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  const sharedForms = await getSharedForms(context)
  if (context.result) {
    uniquePushInResult(context, sharedForms)
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
    update: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
    patch: [
      checkMaxForms(),
      checkPaidComponents(),
    ],
  },
  after: {
    all: [
      populateSharedForms(),
    ],
  },
}

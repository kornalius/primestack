import { Static } from '@feathersjs/typebox'
import isNil from 'lodash/isNil'
import i18next from 'i18next'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { schema } from '@/shared/schemas/share'
import { isShareValid } from '@/shared/share'

type Share = Static<typeof schema>

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

/**
 * Send an email when a share is created or updated
 */
export const sendEmail = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const share = context.data as Share

  const emailRegEx = /^([a-zA-Z\d_.-])+@(([a-zA-Z\d-])+\.)+([a-zA-Z\d]{2,4})+$/g

  /**
   * Check if valid share (not disabled, within valid dates...), email is valid and
   * either emailResend is true or emailSent is undefined or null
   */
  if (isShareValid(share)
      && !!share.email.match(emailRegEx)
      && (share.emailResend === true || isNil(share.emailSent))) {
    // TODO: send email here

    share.emailSent = Date.now()
    share.emailResend = false
    share.emailClicked = undefined
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxShares(),
      sendEmail(),
    ],
    patch: [
      sendEmail(),
    ],
  },
}

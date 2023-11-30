import { Static } from '@feathersjs/typebox'
import isNil from 'lodash/isNil'
import i18next from 'i18next'
import nodemailer from 'nodemailer'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'
import { schema } from '@/shared/schemas/share'
import { isShareValid } from '@/shared/share'
import { info } from '@/logger'

type Share = Static<typeof schema>

const emailRegEx = /^([a-zA-Z\d_.-])+@(([a-zA-Z\d-])+\.)+([a-zA-Z\d]{2,4})+$/g

/**
 * Checks to make sure user does not have more shares than is allowed
 */
export const checkMaxShares = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const user = context.params?.user
  const { total } = await context.app.service('shares').find({
    query: {
      createdBy: user._id,
      $limit: 0,
    }
  })
  const m = context.params?.user?.rights?.maxes?.maxShares
  if (m !== -1 && total > m) {
    throw new Forbidden(i18next.t('paid_feature.share', {
      shareCount: m,
      count: m,
      lng: context.params?.user?.locale as string || 'en',
    }))
  }
  return context
}

/**
 * Send an email when a share is created or updated
 */
export const sendEmail = () => async (context: HookContext): Promise<HookContext> => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  const share = context.result as Share

  const url = context.app.get('url')
  const link = `${url}/share-link/${share._id.toString()}`

  const email = context.app.get('email')

  const { user } = context.params

  /**
   * Check if valid share (not disabled, within valid dates...), email is valid and
   * either emailResend is true or emailSent is undefined or null
   */
  if (
    email
    && user
    && isShareValid(share)
    && !!share.email.match(emailRegEx)
    && email !== user.email
    && (share.emailResend === true || isNil(share.emailSent))
  ) {
    info(`Sending share link email to ${share.email}...`)

    const shareUser = (await context.app.service('users').find({
      query: {
        email: share.email,
      }
    })).data?.[0]

    const transporter = nodemailer.createTransport({
      service: email.service,
      host: email.host,
      port: email.port,
      secure: email.secure,
      auth: {
        user: email.user,
        pass: email.pwd,
      },
    })

    const lng = shareUser?.locale as string || user.locale as string || 'en'

    const res = await transporter.sendMail({
      from: context.app.get('email').sender as string,
      to: share.email,
      subject: i18next.t('share.email.subject', {
        firstname: user.firstname,
        lastname: user.lastname,
        lng,
      }) as string,
      text: i18next.t('share.email.text', {
        firstname: user.firstname,
        lastname: user.lastname,
        link,
        lng,
      }),
      html: i18next.t('share.email.html', {
        firstname: user.firstname,
        lastname: user.lastname,
        link: `<a href="${link}" target="_blank">${i18next.t('share.email.link', { lng })}</a>`,
        lng,
      })
    })

    info(`Share link email sent to ${share.email}, ${res.response}`)

    share.emailSent = Date.now()
    share.emailResend = false
    share.emailClicked = undefined

    await context.app.service('shares').patch(share._id.toString(), {
      emailSent: share.emailSent,
      emailResend: share.emailResend,
      emailClicked: share.emailClicked,
    })
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
  after: {
    all: [],
    create: [
      sendEmail(),
    ],
    update: [
      sendEmail(),
    ],
    patch: [
      sendEmail(),
    ],
  },
}

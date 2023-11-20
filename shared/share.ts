import dayjs from 'dayjs'
import { Static } from '@feathersjs/typebox'
import isEmpty from 'lodash/isEmpty'
import { schema } from './schemas/share'

type Share = Static<typeof schema>

export const isShareValid = (share: Share): boolean => {
  // check if share is still valid
  if (!share.disabled) {
    // check for within dates validity
    if (isEmpty(share.validFrom) && isEmpty(share.validUntil)) {
      return true
    }
    const from = dayjs(share.validFrom)
    const to = dayjs(share.validUntil)
    const now = dayjs()
    if (now.isSame(from)
      || now.isSame(to)
      || (now.isAfter(from) && now.isBefore(to))) {
      return true
    }
  }
  return false
}

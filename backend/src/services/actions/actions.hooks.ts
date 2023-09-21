import { checkPaidActions } from '@/hooks/check-paid-actions'

export default {
  before: {
    all: [],
    create: [checkPaidActions],
    update: [checkPaidActions],
    patch: [checkPaidActions],
  },
}

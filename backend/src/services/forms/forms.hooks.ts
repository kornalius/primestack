import { checkPaidComponents } from '@/hooks/check-paid-components'

export default {
  before: {
    all: [],
    create: [checkPaidComponents],
    update: [checkPaidComponents],
    patch: [checkPaidComponents],
  },
}

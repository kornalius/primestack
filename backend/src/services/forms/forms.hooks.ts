import { checkPaidComponents } from '@/hooks/check-paid-components'
import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

const checkMaxForms = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxForms
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} forms, please consider upgrading`
    )
  }
  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxForms,
      checkPaidComponents,
    ],
    update: [
      checkMaxForms,
      checkPaidComponents,
    ],
    patch: [
      checkMaxForms,
      checkPaidComponents,
    ],
  },
}

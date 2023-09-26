import { HookContext } from '@feathersjs/feathers'
import { Forbidden } from '@feathersjs/errors'

export const checkMaxShares = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const user = context.params?.user
  const { count } = await context.app.service('shares').find({
    query: {
      createdBy: user._id,
    }
  })
  const m = context.params?.user?.rights?.maxes?.maxShares
  if (m !== -1 && count >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} shares, please consider upgrading to create more`
    )
  }
  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxShares,
    ],
  },
}

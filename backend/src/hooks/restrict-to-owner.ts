import { Forbidden } from '@feathersjs/errors'
// eslint-disable-next-line import/no-cycle
import { HookContext } from '@/declarations'

/**
 * Checks if user is the owner of the document before updating it
 */
export const restrictToOwner = () => async (context: HookContext) => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { user } = context.params

  if (context.prev?.createdBy && context.prev?.createdBy.toString() !== user._id.toString()) {
    throw new Forbidden()
  }

  return context
}

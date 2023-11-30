import { Forbidden } from '@feathersjs/errors'
// eslint-disable-next-line import/no-cycle
import { CreateServiceOptions, HookContext } from '@/declarations'

/**
 * Checks if user is the owner of the document before updating it
 */
export const restrictToOwner = (options: CreateServiceOptions) => async (context: HookContext) => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  // user can overwrite document
  if (!options.userWrite) {
    return context
  }

  const { user } = context.params

  if (context.prev?.createdBy && context.prev?.createdBy.toString() !== user._id.toString()) {
    // only allow patching specific fields
    if (context.method === 'patch' && options.allowPatch) {
      context.data = options.allowPatch.reduce((acc, k) => ({
        ...acc,
        [k]: context.data[k],
      }), {})
      return context
    }
    throw new Forbidden()
  }

  return context
}

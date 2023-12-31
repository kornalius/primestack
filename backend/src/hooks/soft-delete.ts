// eslint-disable-next-line import/no-cycle
import { HookContext } from '@/declarations'

/**
 * Instead of deleting the document, mark it as such
 */
export const softDelete = () => async (context: HookContext) => {
  const { service, method, params } = context

  if (method === 'remove') {
    context.result = await service.patch(context.id, {
      deletedAt: Date.now(),
      deletedBy: context.params?.user._id,
    }, params)
  }

  return context
}

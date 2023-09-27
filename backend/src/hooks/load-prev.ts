import { HookContext } from '@/declarations'

export const loadPrev = async (context: HookContext) => {
  const { service, method, params } = context

  if (method === 'patch' || method === 'update') {
    context.prev = await service.get(context.id, params)
  }

  return context
}

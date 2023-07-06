import { HookContext } from '@/declarations'

export const totalCalls: Record<string, number> = {
  total: 0,
  find: 0,
  get: 0,
  create: 0,
  update: 0,
  patch: 0,
  remove: 0,
}

export const countCalls = async (context: HookContext) => {
  totalCalls[context.method] += 1
  totalCalls.total += 1

  return context
}

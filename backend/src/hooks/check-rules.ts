import { Forbidden } from '@feathersjs/errors'
import { Static } from '@feathersjs/typebox'
import { HookContext } from '@/declarations'
import { schema } from '@/shared/schemas/rule'

type Rule = Static<typeof schema>

const methodToRuleName: Record<string, string> = {
  get: 'read',
  find: 'read',
  create: 'create',
  patch: 'update',
  update: 'update',
  remove: 'delete',
}

export const checkRules = async (context: HookContext) => {
  const {
    path,
    method,
    params,
  } = context

  // skip check if from internal server
  if (!params.connection) {
    return context
  }

  const { user } = params
  const { rules } = user

  const m = methodToRuleName[method]

  // if only one rule and it's matching all tables
  if (rules.length === 1 && rules[0].tableId === undefined) {
    if (!rules[0][m]) {
      throw new Forbidden()
    }
  } else {
    // if find table but method is false or if does not find table in rules
    const rule = rules.find((r: Rule) => r.tableId === path)
    if (!rule || !rule[m]) {
      throw new Forbidden()
    }
  }

  return context
}

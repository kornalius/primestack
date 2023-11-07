import { Forbidden } from '@feathersjs/errors'
import { Static } from '@feathersjs/typebox'
import { HookContext } from '@/declarations'
import { schema } from '@/shared/schemas/rule'
import { schema as tableSchema } from '@/shared/schemas/table'

type Rule = Static<typeof schema>
type Table = Static<typeof tableSchema>

const methodToRuleName: Record<string, string> = {
  get: 'read',
  find: 'read',
  create: 'create',
  patch: 'update',
  update: 'update',
  remove: 'delete',
}

/**
 * Checks if user has the correct right for the hook method being used
 */
export const checkRules = () => async (context: HookContext) => {
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

  const userTable = (
    await context.app.service('tables').find({ query: {} })
  ).data?.[0]

  // check if current user is owner of the service
  if (userTable) {
    if (userTable.list.find((t: Table) => t._id.toString() === path)) {
      return context
    }
  }

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

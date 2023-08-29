import { authenticate } from '@feathersjs/authentication'
import { Application } from '@feathersjs/koa'
import { Static } from '@feathersjs/typebox'
import { HookContext } from '@feathersjs/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import { passwordHash } from '@feathersjs/authentication-local'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/user'
import { dataValidator } from '@/validators'
import { maxSchema, schema as ruleSchema } from '@/shared/schemas/rule'
import { virtual } from '@feathersjs/schema'

dataValidator.addSchema(schema)

const path = 'users'
const collection = 'users'

class Service extends MongoService {}

type Rule = Static<typeof ruleSchema>
type Maxes = Static<typeof maxSchema>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getItems = (context: HookContext): any => {
  const items = context.type === 'before' ? context.data : context.result
  return items && (context.method === 'find' ? (items.data || items) : items)
}

/**
 * Aggregates the user's plan, group, share and its own rules into a single array of rules
 *
 * @param shareRules Optional share rules array
 */
const aggregateRules = (shareRules: Rule[] = []) => (
  async (context: HookContext): Promise<HookContext> => {
    if (context.method === 'remove') {
      return context
    }

    const mixItem = async (item: AnyData) => {
      const userRules = item.rules || []

      const rules: Rule[] = []

      const mixRules = (rulesToMix: Rule[], sharedRules?: boolean) => {
        const mixRule = (a: boolean, b: boolean): boolean => {
          if (a && !b) {
            return false
          }
          return !a && b
        }

        rulesToMix.forEach((r) => {
          // means all tables (all tables in shared rules should not be possible)
          if (r.tableId === undefined && !sharedRules) {
            rules.length = 0
            rules.push(r)
            return
          }

          const found = rules.find((rr) => rr.tableId === r.tableId)
          if (found) {
            found.read = mixRule(found.read, r.read)
            found.create = mixRule(found.create, r.create)
            found.update = mixRule(found.update, r.update)
            found.delete = mixRule(found.delete, r.delete)
            return
          }

          rules.push(r)
        })
      }

      const planRules = item.planId
        ? (await context.app.service('plans').get(item.planId))?.rules || []
        : []

      const groupRules = item.groupId
        ? (await context.app.service('groups').get(item.groupId))?.rules || []
        : []

      mixRules(planRules)
      mixRules(groupRules)
      mixRules(shareRules, true)
      mixRules(userRules)

      // eslint-disable-next-line no-param-reassign
      item.rights = { rules }
    }

    const items = getItems(context)

    if (Array.isArray(items)) {
      await Promise.all(items.map((i) => mixItem(i)))
    } else {
      await mixItem(items)
    }

    return context
  }
)

/**
 * Aggregates the user's plan, group, share and its own maximums into a single array of maximums
 */
const aggregateMaxes = () => async (context: HookContext): Promise<HookContext> => {
  if (context.method === 'remove') {
    return context
  }

  const mixItem = async (item: AnyData) => {
    const plan = item.planId
      ? await context.app.service('plans').get(item.planId)
      : undefined

    const group = item.groupId
      ? await context.app.service('groups').get(item.groupId)
      : undefined

    const user = item

    const maxes: Maxes = {
      maxShares: 0,
      maxRecords: 0,
      maxTables: 0,
      maxFiles: 0,
      maxFileSize: 0,
    }

    const mixMaxes = (maxesToMix: AnyData) => {
      const mixMax = (a: number, b: number) => {
        if (b !== -1 && (a === -1 || a > b)) {
          return a
        }
        return b
      }

      maxes.maxShares = mixMax(maxesToMix.maxShares, maxes.maxShares)
      maxes.maxRecords = mixMax(maxesToMix.maxRecords, maxes.maxRecords)
      maxes.maxTables = mixMax(maxesToMix.maxTables, maxes.maxTables)
      maxes.maxFiles = mixMax(maxesToMix.maxFiles, maxes.maxFiles)
      maxes.maxFileSize = mixMax(maxesToMix.maxFileSize, maxes.maxFileSize)
    }

    if (plan) {
      mixMaxes(plan)
    }
    if (group) {
      mixMaxes(group)
    }
    mixMaxes(user)

    // eslint-disable-next-line no-param-reassign
    item.rights.maxes = maxes
  }

  const items = getItems(context)

  if (Array.isArray(items)) {
    await Promise.all(items.map((i) => mixItem(i)))
  } else {
    await mixItem(items)
  }

  return context
}

/**
 * Aggregates group's planId
 */
const aggregateGroupPlanId = () => async (context: HookContext): Promise<HookContext> => {
  if (context.method === 'remove') {
    return context
  }

  const mixItem = async (item: AnyData) => {
    // replace user's planId with the group's planId
    if (item.groupId) {
      const groupPlanId = (await context.app.service('groups').get(item.groupId))?.planId
      if (groupPlanId) {
        // eslint-disable-next-line no-param-reassign
        item.planId = groupPlanId
      }
    }
  }

  const items = getItems(context)

  if (Array.isArray(items)) {
    await Promise.all(items.map((i) => mixItem(i)))
  } else {
    await mixItem(items)
  }

  return context
}

const service = createService(path, Service, {
  collection,
  schema,
  indexes: [
    {
      fields: { email: 1 },
      unique: true,
    }
  ],
  methods: ['find', 'get', 'create', 'patch', 'remove'],
  validators: {
    data: ['email', 'password', 'googleId', 'facebookId', 'twitterId', 'githubId', 'auth0Id'],
    query: ['email', 'password', 'googleId', 'facebookId', 'twitterId', 'githubId', 'auth0Id'],
  },
  resolvers: {
    external: {
      password: async () => undefined
    },
    data: {
      $create: {
        password: passwordHash({ strategy: 'local' })
      },
      $update: {
        password: passwordHash({ strategy: 'local' })
      },
    },
    result: {
      _plan: virtual(async (record: AnyData, context: HookContext) => {
        if (record.planId) {
          // Populate the plan associated
          return context.app.service('plans').get(record.planId)
        }
        return undefined
      }),
      _group: virtual(async (record: AnyData, context: HookContext) => {
        if (record.groupId) {
          // Populate the plan associated
          return context.app.service('groups').get(record.groupId)
        }
        return undefined
      }),
    },
    query: {
      _id: async (value: AnyData, user: AnyData, context: HookContext) => {
        if (context.params.user) {
          return context.params.user._id
        }
        return value
      }
    }
  },
  hooks: {
    around: {
      all: [],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    },
    after: {
      all: [
        aggregateRules(),
        aggregateMaxes(),
        aggregateGroupPlanId(),
      ],
    },
  }
})

export default function (app: Application): void {
  service.init(app, {})
}

export type User = Static<typeof service.schemas.main>

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

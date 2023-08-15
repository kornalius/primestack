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
import { schema as maxSchema, ruleSchema } from '@/shared/schemas/rule'

dataValidator.addSchema(schema)

const path = 'users'
const collection = 'users'

class Service extends MongoService {}

type Rule = Static<typeof ruleSchema>
type Maxes = Static<typeof maxSchema>

/**
 * Aggregates the user's plan, group, share and its own rules into a single array of rules
 *
 * @param shareRules Optional share rules array
 */
const aggregateRules = (shareRules: Rule[] = []) => async (context: HookContext): Promise<HookContext> => {
  const planRules = context.result.planId
    ? (await context.app.service('plans').get(context.result.planId))?.rules || []
    : []

  const groupRules = context.result.groupId
    ? (await context.app.service('groups').get(context.result.groupId))?.rules || []
    : []

  const userRules = context.result.rules || []

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

  mixRules(planRules)
  mixRules(groupRules)
  mixRules(shareRules, true)
  mixRules(userRules)

  context.result.rules = rules

  return context
}

/**
 * Aggregates the user's plan, group, share and its own maximums into a single array of maximums
 */
const aggregateMaxes = () => async (context: HookContext): Promise<HookContext> => {
  const plan = context.result.planId
    ? await context.app.service('plans').get(context.result.planId)
    : undefined

  const group = context.result.groupId
    ? await context.app.service('groups').get(context.result.groupId)
    : undefined

  const user = context.result

  const maxes: Maxes = {
    maxShares: 0,
    maxRecords: 0,
    maxTables: 0,
    maxFiles: 0,
    maxFileSize: 0,
  }

  const mixMaxes = (maxesToMix: Maxes) => {
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

  context.result.maxes = maxes

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
      all: [],
      get: [aggregateRules(), aggregateMaxes()],
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

import { authenticate } from '@feathersjs/authentication'
// eslint-disable-next-line import/no-cycle
import { HookContext } from '@/declarations'
import { Static } from '@feathersjs/typebox'
import { maxSchema, schema as ruleSchema } from '@/shared/schemas/rule'
import { AnyData } from '@/shared/interfaces/commons'
import { Forbidden } from '@feathersjs/errors'
import i18next from 'i18next'

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
      maxMenus: 0,
      maxForms: 0,
      maxEdits: 0,
      maxTables: 0,
      maxFiles: 0,
      maxFileSize: 0,
      maxSettings: 0,
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
      maxes.maxMenus = mixMax(maxesToMix.maxMenus, maxes.maxMenus)
      maxes.maxForms = mixMax(maxesToMix.maxForms, maxes.maxForms)
      maxes.maxEdits = mixMax(maxesToMix.maxEdits, maxes.maxEdits)
      maxes.maxTables = mixMax(maxesToMix.maxTables, maxes.maxTables)
      maxes.maxFiles = mixMax(maxesToMix.maxFiles, maxes.maxFiles)
      maxes.maxFileSize = mixMax(maxesToMix.maxFileSize, maxes.maxFileSize)
      maxes.maxSettings = mixMax(maxesToMix.maxSettings, maxes.maxSettings)
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

/**
 * Checks the maximum number of user's setting keys allowed
 */
const checkMaxSettings = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const count = Object.keys(context.data.settings || {})
  const m = context.params?.user?.rights?.maxes?.maxSettings
  if (m !== -1 && count > m) {
    throw new Forbidden(i18next.t('paid_feature.setting', {
      settingCount: m,
      count: m,
      lng: context.params?.user?.locale as string || 'en',
    }))
  }
  return context
}

export default {
  around: {
    all: [],
    find: [
      authenticate('jwt'),
    ],
    get: [
      authenticate('jwt'),
    ],
    update: [
      authenticate('jwt'),
    ],
    patch: [
      authenticate('jwt'),
    ],
    remove: [
      authenticate('jwt'),
    ],
  },
  before: {
    all: [],
    created: [
      checkMaxSettings(),
    ],
    update: [
      checkMaxSettings(),
    ],
    patch: [
      checkMaxSettings(),
    ],
  },
  after: {
    all: [
      aggregateRules(),
      aggregateMaxes(),
      aggregateGroupPlanId(),
    ],
  },
}

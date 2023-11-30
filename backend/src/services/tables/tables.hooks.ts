import i18next from 'i18next'
import diff from '@/diff-arrays'
import { Application } from '@/declarations'
import pick from 'lodash/pick'
import camelCase from 'lodash/camelCase'
import capitalize from 'lodash/capitalize'
import kebabCase from 'lodash/kebabCase'
import snakeCase from 'lodash/snakeCase'
import startCase from 'lodash/startCase'
import trim from 'lodash/trim'
import trimStart from 'lodash/trimStart'
import trimEnd from 'lodash/trimEnd'
import deburr from 'lodash/deburr'
import escape from 'lodash/escape'
import unescape from 'lodash/unescape'
import truncate from 'lodash/truncate'
import ceil from 'lodash/ceil'
import floor from 'lodash/floor'
import round from 'lodash/round'
import random from 'lodash/random'
import { virtual } from '@feathersjs/schema'
import { Static, TObject } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-extraneous-dependencies
import { PaginationOptions } from '@feathersjs/adapter-commons'
import { HookContext, Paginated, Params } from '@feathersjs/feathers'
import { BadRequest, Forbidden } from '@feathersjs/errors'
import { loadPrev } from '@/hooks/load-prev'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'
import { fieldsToSchema, indexesToMongo, refFieldname } from '@/shared/schema'
import { createService, MongoService } from '@/service'
import { checkRules } from '@/hooks/check-rules'
import { AdapterId, NullableAdapterId } from '@feathersjs/mongodb/src/adapter'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { getSharedTables } from '@/shared-utils'
import { uniquePushInResult } from '@/shared/utils'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

/**
 * Checks to make sure user does not have more tables than is allowed
 */
const checkMaxTables = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxTables
  if (m !== -1 && context.data?.list.length > m) {
    throw new Forbidden(i18next.t('paid_feature.table', {
      tableCount: m,
      count: m,
      lng: context.params?.user?.locale as string || 'en',
    }))
  }
  return context
}

/**
 * Checks to make sure user does not have more records than is allowed
 */
const checkMaxRecords = () => async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { total } = await context.app.service(context.path).find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxRecords
  if (m !== -1 && total > m) {
    throw new Forbidden(i18next.t('paid_feature.record', {
      recordCount: m,
      count: m,
      lng: context.params?.user?.locale as string || 'en',
    }))
  }
  return context
}

/**
 * Forces the data to have the created, updated fields set to to true
 */
const forceCreatedAndUpdated = () => async (context: HookContext) => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  context.data.list.forEach((table: Table) => {
    // eslint-disable-next-line no-param-reassign
    table.created = true
    // eslint-disable-next-line no-param-reassign
    table.updated = true
  })

  return context
}

/**
 * Set each table 'path' to a string version of the _id
 * This is to ease search for with context.path
 */
const setPaths = () => async (context: HookContext) => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  context.data.list.forEach((table: Table) => {
    // eslint-disable-next-line no-param-reassign
    table.path = table._id.toString()
  })

  return context
}

/**
 * Populate list of tables with shared tables as well
 */
const populateSharedTables = () => async (context: HookContext): Promise<HookContext> => {
  // skip if from internal server
  if (!context.params.connection) {
    return context
  }

  const sharedTables = await getSharedTables(context)
  if (context.result) {
    uniquePushInResult(context.result.data, sharedTables)
  }

  return context
}

class DynamicService extends MongoService {
  async getTable(): Promise<Table | undefined> {
    const { app, name } = (this.options as AnyData)
    const table = (await app.service('tables').find({ query: {} })).data?.[0]
    if (table) {
      return table.list.find((t: Table) => t._id.toString() === name)
    }
    return undefined
  }

  async create(data: AnyData, params?: Params): Promise<AnyData>
  async create(data: AnyData[], params?: Params): Promise<AnyData[]>
  async create(data: AnyData | AnyData[], params?: Params): Promise<AnyData | AnyData[]>
  async create(data: AnyData | AnyData[], params?: Params): Promise<AnyData | AnyData[]> {
    const { app, name } = this.options as AnyData

    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          throw new Forbidden()
        case 'files':
          return app.service('files').create(data, params)
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    const r = await super.create(data, params)
    app.service('stats').emit('calculate', { path: name })
    return r
  }

  async get(id: AdapterId, params?: Params) {
    const { app } = (this.options as AnyData)
    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          throw new Forbidden()
        case 'files':
          return app.service('files').get(id, params)
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    return super.get(id, params)
  }

  async find(params?: Params & { paginate?: PaginationOptions }): Promise<Paginated<AnyData>>
  async find(params?: Params & { paginate: false }): Promise<AnyData[]>
  async find(params?: Params): Promise<Paginated<AnyData> | AnyData[]>
  async find(params?: Params): Promise<Paginated<AnyData> | AnyData[]> {
    const { app } = (this.options as AnyData)
    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          return app.service('events').find(params)
        case 'files':
          return app.service('files').find(params)
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    return super.find(params)
  }

  async update(id: AdapterId, data: AnyData, params?: Params): Promise<AnyData> {
    const { app, name } = this.options as AnyData

    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          throw new Forbidden()
        case 'files':
          throw new Forbidden()
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    const r = await super.update(id, data, params)
    app.service('stats').emit('calculate', { path: name })
    return r
  }

  async patch(id: null, data: AnyData, params?: Params): Promise<AnyData[]>
  async patch(id: AdapterId, data: AnyData, params?: Params): Promise<AnyData>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]> {
    const { app, name } = this.options as AnyData

    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          throw new Forbidden()
        case 'files':
          throw new Forbidden()
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    const r = await super.patch(id, data, params)
    app.service('stats').emit('calculate', { path: name })
    return r
  }

  async remove(id: AdapterId, params?: Params): Promise<AnyData>
  async remove(id: null, params?: Params): Promise<AnyData[]>
  async remove(id: NullableAdapterId, params?: Params): Promise<AnyData | AnyData[]>
  async remove(id: NullableAdapterId, params?: Params): Promise<AnyData | AnyData[]> {
    const { app, name } = this.options as AnyData

    const t = await this.getTable()
    if (t) {
      switch (t.service) {
        case 'events':
          throw new Forbidden()
        case 'files':
          return app.service('files').remove(id, params)
        default:
          break
      }
    }

    // TODO: Check share rules & accessLevel

    const r = await super.remove(id, params)
    app.service('stats').emit('calculate', { path: name })
    return r
  }
}

export const createDynamicService = (app: Application, id: string, t: AnyData) => {
  info(`Creating user service ${id}...`)

  // TODO: Add to validate string fields to have $regex

  // const querySyntax: AnyData = {}
  //
  // t.fields
  //   .filter((f: TableField) => f.queryable && f.type === 'string')
  //   .forEach((f: TableField) => {
  //     querySyntax[f.name] = Type.Optional(Type.Union([
  //       Type.String(),
  //       Type.Object({
  //         $regex: Type.String(),
  //         $options: Type.String(),
  //       }),
  //     ]))
  //   })

  const dataResolvers: Record<string, unknown> = {}
  const resultResolvers: Record<string, unknown> = {}

  // Transform field data resolvers
  t.fields
    .filter((f: TableField) => f.transforms?.length)
    .forEach((f: TableField) => {
      dataResolvers[f.name] = (value: unknown) => {
        let v = value
        f.transforms?.forEach((t) => {
          if (typeof v === 'string') {
            const s = v as string
            switch (t.type) {
              case 'lowerCase':
                v = s.toLowerCase()
                break
              case 'upperCase':
                v = s.toUpperCase()
                break
              case 'capitalize':
                v = capitalize(s)
                break
              case 'camelCase':
                v = camelCase(s)
                break
              case 'kebabCase':
                v = kebabCase(s)
                break
              case 'snakeCase':
                v = snakeCase(s)
                break
              case 'startCase':
                v = startCase(s)
                break
              case 'cleanup':
                v = s.replace(/[^a-zA-Z0-9-_]/, '')
                break
              case 'escape':
                v = escape(s)
                break
              case 'unescape':
                v = unescape(s)
                break
              case 'truncate':
                v = truncate(s, { length: t.value })
                break
              case 'trim':
                v = trim(s)
                break
              case 'trimLeft':
                v = trimStart(s)
                break
              case 'trimRight':
                v = trimEnd(s)
                break
              case 'deburr':
                v = deburr(s)
                break
              default:
                break
            }
          } else if (typeof v === 'number') {
            const i = v as number
            switch (t.type) {
              case 'min':
                v = Math.min(t.value || 0, i)
                break
              case 'max':
                v = Math.max(t.value || 0, i)
                break
              case 'ceil':
                v = ceil(i, t.value || 0)
                break
              case 'floor':
                v = floor(i, t.value || 0)
                break
              case 'round':
                v = round(i, t.value || 0)
                break
              default: break
            }
          } else if (t.type === 'random') {
            v = random(t.value || 1)
          } else if (t.type === 'discard') {
            v = undefined
          }
        })
        return v
      }
    })

  /**
   * Secret fields resolvers (only viewable by its creator)
   */
  t.fields
    .filter((f: TableField) => f.secret)
    .forEach((f: TableField) => {
      resultResolvers[f.name] = async (record: AnyData, context: HookContext) => {
        if (context.user._id !== record.createdBy) {
          return undefined
        }
        return record[f.name]
      }
    })

  /**
   * Create resolvers for fields with refTableId and refFields specified.
   */
  t.fields
    .filter((f: TableField) => f.refTableId)
    .forEach((f: TableField) => {
      resultResolvers[refFieldname(f.name)] = virtual(async (record: AnyData, context: HookContext) => {
        if (record[f.name]) {
          if (f.refTableId === t._id) {
            throw new BadRequest(i18next.t('table.sameTableResolve', {
              lng: context.params?.user?.locale as string || 'en',
            }))
          }

          if (f.array) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (await context.app.service(f.refTableId as string).find({
              query: {
                _id: { $in: record[f.name] },
                $select: f.refFields?.length ? f.refFields : undefined,
                $limit: -1,
                $skip: 0,
              },
            })).data
          }

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const data = await context.app.service(f.refTableId as string).get(record[f.name])
          if (f.refFields?.length) {
            return pick(data, f.refFields)
          }
          return data
        }
        return undefined
      })
    })

  createService(id, DynamicService, {
    collection: id,
    schema: fieldsToSchema(t.fields, id) as TObject,
    indexes: indexesToMongo(t.indexes),
    methods: t.methods,
    created: t.created,
    updated: t.updated,
    userRead: t.userRead,
    userWrite: t.userWrite,
    hooks: {
      before: {
        all: [
          checkRules(),
        ],
        create: [
          checkMaxRecords(),
        ]
      },
    },
    validators: {
      // querySyntax: Object.keys(querySyntax).length ? querySyntax : undefined,
    },
    resolvers: {
      data: dataResolvers,
      result: resultResolvers,
    }
  }).init(app, {})
}

/**
 * The tables have been updated, registers the services again
 */
const updateCollections = () => (context: HookContext) => {
  if (context.data?.list) {
    const d = diff(
      context.prev?.list || [],
      context.data.list,
      (value: AnyData) => value._id.toString(),
    )

    const toRemove: AnyData[] = [...d.removed]
    const toUpdate: AnyData[] = [...d.added, ...d.updated]

    toRemove.forEach(async (t) => {
      info(`Unusing user service ${t._id.toString()}...`)
      await context.app.unuse(t._id.toString())
    })

    toUpdate.forEach(async (t) => {
      const id = t._id.toString()
      await context.app.unuse(id)
      createDynamicService(context.app as Application, id, t)
    })
  }

  return context
}

export default {
  before: {
    all: [],
    create: [
      checkMaxTables(),
      setPaths(),
      forceCreatedAndUpdated(),
      updateCollections(),
    ],
    update: [
      checkMaxTables(),
      loadPrev(),
      setPaths(),
      forceCreatedAndUpdated(),
      updateCollections(),
    ],
    patch: [
      checkMaxTables(),
      loadPrev(),
      setPaths(),
      forceCreatedAndUpdated(),
      updateCollections(),
    ],
  },
  after: {
    all: [
      populateSharedTables(),
    ],
  },
}

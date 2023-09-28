import diff from '@/diff-arrays'
import { Application } from '@feathersjs/koa'
import { pick } from 'lodash'
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

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

const checkMaxTables = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const m = context.params?.user?.rights?.maxes?.maxTables
  if (m !== -1 && context.data?.list.length >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} tables, please consider upgrading`
    )
  }
  return context
}

const checkMaxRecords = async (context: HookContext): Promise<HookContext> => {
  // skip check if from internal server
  if (!context.params.connection) {
    return context
  }

  const { count } = await context.app.service(context.path).find({ query: { $limit: 0 } })
  const m = context.params?.user?.rights?.maxes?.maxRecords
  if (m !== -1 && count >= m) {
    throw new Forbidden(
      `Your plan only supports ${m} records per table, please consider upgrading`
    )
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: AnyData, params?: Params): Promise<AnyData>
  async create(data: AnyData[], params?: Params): Promise<AnyData[]>
  async create(data: AnyData | AnyData[], params?: Params): Promise<AnyData | AnyData[]>
  async create(data: AnyData | AnyData[], params?: Params): Promise<AnyData | AnyData[]> {
    const { app } = (this.options as AnyData)
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
    return super.create(data, params)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return super.get(id, params)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return super.find(params)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: AdapterId, data: AnyData, params?: Params): Promise<AnyData> {
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
    return super.update(id, data, params)
  }

  async patch(id: null, data: AnyData, params?: Params): Promise<AnyData[]>
  async patch(id: AdapterId, data: AnyData, params?: Params): Promise<AnyData>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]>
  async patch(id: NullableAdapterId, data: AnyData, params?: Params): Promise<AnyData | AnyData[]> {
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
    return super.patch(id, data, params)
  }

  async remove(id: AdapterId, params?: Params): Promise<AnyData>
  async remove(id: null, params?: Params): Promise<AnyData[]>
  async remove(id: NullableAdapterId, params?: Params): Promise<AnyData | AnyData[]>
  async remove(id: NullableAdapterId, params?: Params): Promise<AnyData | AnyData[]> {
    const { app } = (this.options as AnyData)
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
    return super.remove(id, params)
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

  /**
   * Create resolvers for fields with refTableId and refFields specified.
   */

  const resultResolvers: Record<string, AnyData> = {}

  t.fields
    .filter((f: TableField) => f.refTableId)
    .forEach((f: TableField) => {
      resultResolvers[refFieldname(f.name)] = virtual(async (
        record: AnyData,
        context: HookContext,
      ) => {
        if (record[f.name]) {
          if (f.refTableId === t._id) {
            throw new BadRequest('Cannot resolve on the same table')
          }

          if (f.array) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return (await context.app.service(f.refTableId as string).find({
              query: {
                _id: { $in: record[f.name] },
                $select: f.refFields?.length ? f.refFields : undefined,
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
    user: t.user,
    hooks: {
      before: {
        all: [
          checkRules,
        ],
        create: [
          checkMaxRecords,
        ]
      }
    },
    validators: {
      // querySyntax: Object.keys(querySyntax).length ? querySyntax : undefined,
    },
    resolvers: {
      result: resultResolvers,
    }
  }).init(app, {})
}

const updateCollections = (context: HookContext) => {
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

const forceCreatedAndUpdated = async (context: HookContext) => {
  // skip check if from internal server
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

export default {
  before: {
    all: [],
    create: [
      checkMaxTables,
      forceCreatedAndUpdated,
      updateCollections,
    ],
    update: [
      checkMaxTables,
      loadPrev,
      updateCollections,
      forceCreatedAndUpdated,
    ],
    patch: [
      checkMaxTables,
      loadPrev,
      updateCollections,
      forceCreatedAndUpdated,
    ],
  },
}

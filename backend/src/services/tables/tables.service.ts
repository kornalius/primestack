import { Application } from '@feathersjs/koa'
import { Static, TObject } from '@feathersjs/typebox'
import { Forbidden } from '@feathersjs/errors'
import { AdapterId, NullableAdapterId } from '@feathersjs/mongodb/src/adapter'
import { Paginated, Params } from '@feathersjs/feathers'
// eslint-disable-next-line import/no-extraneous-dependencies
import { PaginationOptions } from '@feathersjs/adapter-commons'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema, tableSchema } from '@/shared/schemas/table'
import { dataValidator } from '@/validators'
import { loadPrev } from '@/hooks/load-prev'
import { HookContext } from '@/declarations'
import { fieldsToSchema, indexesToMongo } from '@/shared/schema'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'
import diff from '@/diff-arrays'
import { checkRules } from '@/hooks/check-rules'
import { checkMaxRecords, checkMaxTables } from './tables.hooks'

dataValidator.addSchema(schema)

const path = 'tables'
const collection = 'tables'

type Table = Static<typeof tableSchema>

class Service extends MongoService {}

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

const createDynamicService = (app: Application, id: string, t: AnyData) => {
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
  }).init(app, {})
}

const updateCollections = (context: HookContext) => {
  if (context.data?.list) {
    const d = diff(
      context.prev.list,
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
      createDynamicService(context.app, id, t)
    })
  }

  return context
}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    indexes: [
      {
        fields: { name: 1 },
        unique: true,
      },
    ],
    created: true,
    updated: true,
    user: true,
    authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    hooks: {
      before: {
        all: [],
        create: [
          checkMaxTables,
        ],
        patch: [
          loadPrev,
          updateCollections,
        ],
      },
    },
  }).init(app, {})

  // initialize paths + collections
  app.service('tables').find({ query: {} })
    .then(({ data }) => {
      data.forEach((d: AnyData) => {
        d.list.forEach((t: AnyData) => {
          const id = t._id.toString()
          createDynamicService(app, id, t)
        })
      })
    })
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

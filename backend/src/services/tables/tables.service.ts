import { Application } from '@feathersjs/koa'
import { TObject } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/table'
import { dataValidator } from '@/validators'
import { loadPrev } from '@/hooks/load-prev'
import { HookContext } from '@/declarations'
import { fieldsToSchema, indexesToMongo } from '@/shared/schema'
import { AnyData } from '@/shared/interfaces/commons'
import { info } from '@/logger'
import diff from '@/diff-arrays'
import { checkRule } from '@/hooks/checkRule'

dataValidator.addSchema(schema)

const path = 'tables'
const collection = 'tables'

class Service extends MongoService {}

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
      await context.app.unuse(t._id.toString())
    })

    toUpdate.forEach(async (t) => {
      const id = t._id.toString()
      await context.app.unuse(id)
      createService(id, Service, {
        collection: id,
        schema: fieldsToSchema(t.fields, id) as TObject,
        indexes: indexesToMongo(t.indexes),
        methods: t.methods,
        created: t.created,
        updated: t.updated,
        user: t.user,
      }).init(context.app, {})
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
        patch: [loadPrev, updateCollections],
      },
    },
  }).init(app, {})

  // initialize paths + collections
  app.service('tables').find({ query: {} })
    .then(({ data }) => {
      data.forEach((d: AnyData) => {
        d.list.forEach((t: AnyData) => {
          const id = t._id.toString()
          info(`Creating user service ${id}...`)
          createService(id, Service, {
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
                  checkRule,
                ]
              }
            }
          }).init(app, {})
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

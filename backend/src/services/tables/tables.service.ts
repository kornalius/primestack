import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/table'
import { dataValidator } from '@/validators'
import { AnyData } from '@/shared/interfaces/commons'
import hooks, { createDynamicService } from './tables.hooks'

dataValidator.addSchema(schema)

const path = 'tables'
const collection = 'tables'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    userRead: true,
    userWrite: true,
    authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    hooks,
  }).init(app, {})

  // initialize paths + collections
  app.service('tables').find({ query: { $limit: -1, $skip: 0 } })
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

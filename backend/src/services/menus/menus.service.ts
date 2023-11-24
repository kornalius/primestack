import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/menu'
import { dataValidator } from '@/validators'
import hooks from './menus.hooks'

dataValidator.addSchema(schema)

const path = 'menus'
const collection = 'menus'

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
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

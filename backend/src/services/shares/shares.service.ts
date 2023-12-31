import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { dataValidator } from '@/validators'
import { schema } from '@/shared/schemas/share'
import hooks from './shares.hooks'

dataValidator.addSchema(schema)

const path = 'shares'
const collection = 'shares'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    userWrite: true,
    allowPatch: ['userId', 'emailClicked'],
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

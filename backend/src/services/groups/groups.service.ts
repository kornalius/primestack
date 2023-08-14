import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/group'
import { dataValidator } from '@/validators'

dataValidator.addSchema(schema)

const path = 'groups'
const collection = 'groups'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

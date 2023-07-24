import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/table'

const path = 'tables'
const collection = 'tables'

class Service extends MongoService {}

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
    // authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
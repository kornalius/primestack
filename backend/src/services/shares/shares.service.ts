import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { dataValidator } from '@/validators'
import { schema } from '@/shared/schemas/share'
import { checkMaxShares } from './shares.hooks'
import resolvers from './shares.resolvers'

dataValidator.addSchema(schema)

const path = 'shares'
const collection = 'shares'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    hooks: {
      before: {
        all: [],
        create: [checkMaxShares],
      },
    },
    resolvers,
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

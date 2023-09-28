import { Application } from '@feathersjs/koa'
import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/user'
import { dataValidator } from '@/validators'
import hooks from './users.hooks'
import resolvers from './users.resolvers'

dataValidator.addSchema(schema)

const path = 'users'
const collection = 'users'

class Service extends MongoService {}

const service = createService(path, Service, {
  collection,
  schema,
  indexes: [
    {
      fields: { email: 1 },
      unique: true,
    }
  ],
  methods: ['find', 'get', 'create', 'patch', 'remove'],
  resolvers,
  hooks,
})

export default function (app: Application): void {
  service.init(app, {})
}

export type User = Static<typeof service.schemas.main>

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

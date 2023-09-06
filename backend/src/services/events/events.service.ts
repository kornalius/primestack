import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { HookContext } from '@/declarations'
import { AnyData } from '@/shared/interfaces/commons'
import { schema } from '@/shared/schemas/event'
import { dataValidator } from '@/validators'

dataValidator.addSchema(schema)

const path = 'events'
const collection = 'events'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    authentication: true,
    methods: ['find', 'get', 'create'],
    resolvers: {
      query: {
        ownerId: async (value: AnyData, query: AnyData, context: HookContext) => {
          if (context.params?.user) {
            return context.params.user._id
          }
          return value
        },
      },
    },
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

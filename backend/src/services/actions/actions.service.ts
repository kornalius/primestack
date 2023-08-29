import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema } from '@/shared/schemas/actions'
import { dataValidator } from '@/validators'
import { checkPaidActions } from '@/hooks/check-paid-actions'

dataValidator.addSchema(schema)

const path = 'actions'
const collection = 'actions'

class Service extends MongoService {}

export default function (app: Application): void {
  createService(path, Service, {
    collection,
    schema,
    created: true,
    updated: true,
    user: true,
    authentication: true,
    methods: ['find', 'get', 'create', 'patch', 'remove'],
    hooks: {
      before: {
        all: [],
        create: [checkPaidActions],
        update: [checkPaidActions],
        patch: [checkPaidActions],
      }
    },
  }).init(app, {})
}

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}

import { Application } from '@feathersjs/koa'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema, actionSchema } from '@/shared/schemas/actions'
import { dataValidator } from '@/validators'
import { checkPaidActions } from '@/hooks/check-paid-actions'
import { virtual } from '@feathersjs/schema'
import { Static } from '@feathersjs/typebox'

type ActionSchema = Static<typeof schema>
type Action = Static<typeof actionSchema>

dataValidator.addSchema(schema)

const path = 'actions'
const collection = 'actions'

class Service extends MongoService {}

export default function (app: Application): void {
  // return a list of action ids in the list
  const actionIds = virtual(async (value: ActionSchema) => (
    value?.list.map((a: Action) => a._id.toString())
  ))

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
      },
    },
    resolvers: {
      data: {
        actionIds,
      },
      result: {
        actionIds,
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

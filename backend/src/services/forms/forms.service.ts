import { Application } from '@feathersjs/koa'
import { Static } from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '@/service'
import { schema, formSchema } from '@/shared/schemas/form'
import { dataValidator } from '@/validators'
import { checkPaidComponents } from '@/hooks/check-paid-components'
import { virtual } from '@feathersjs/schema'

type FormSchema = Static<typeof schema>
type Form = Static<typeof formSchema>

dataValidator.addSchema(schema)

const path = 'forms'
const collection = 'forms'

class Service extends MongoService {}

export default function (app: Application): void {
  // return a list of form ids in the list
  const formIds = virtual(async (value: FormSchema) => (
    value?.list.map((f: Form) => f._id.toString())
  ))

  // return a list of all the table ids used in the forms
  const tableIds = virtual(async (value: FormSchema) => (
    value
      ? value.list
        .filter((f: Form) => f.tableId)
        .map((f: Form) => f.tableId?.toString())
      : []
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
        create: [checkPaidComponents],
        update: [checkPaidComponents],
        patch: [checkPaidComponents],
      },
    },
    resolvers: {
      data: {
        formIds,
        tableIds,
      },
      result: {
        formIds,
        tableIds,
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

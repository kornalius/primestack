import get from 'lodash/get'
// eslint-disable-next-line import/no-cycle
import { CreateServiceOptions, HookContext } from '@/declarations'
import {
  getValidator, querySyntax, Static, Type
} from '@feathersjs/typebox'
import { resolve, hooks as schemaHooks } from '@feathersjs/schema'
import { authenticate } from '@feathersjs/authentication'
import { Application } from '@feathersjs/koa'
import { NextFunction, Params, ServiceInterface } from '@feathersjs/feathers'
import { HookFunction } from '@feathersjs/feathers/src/declarations'
import { AnyData } from '@/shared/commons'
import { MongoDBService } from '@feathersjs/mongodb'
import { Collection, Db } from 'mongodb'
import omit from 'lodash/omit'
import {
  dataValidator as validatorForData,
  queryValidator as validatorForQuery,
} from './validators'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Newable<T> = { new (...args: any[]): T; }

export interface ServiceOptions {
  app: Application
}

export class BaseService {
  private app: Application

  constructor(options: ServiceOptions) {
    this.app = options.app
  }
}

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class MongoService<ServiceParams extends Params = AnyData> extends MongoDBService<
  AnyData,
  AnyData,
  AnyData,
  AnyData
> {}

export const createService = (name: string, klass: Newable<AnyData>, options: CreateServiceOptions) => {
  type TSType = Static<typeof options.schema>

  const resultResolver = resolve<TSType, HookContext>(
    options.resolvers?.result || {}
  )

  const externalResolver = resolve<TSType, HookContext>(
    options.resolvers?.external || {}
  )

  const dataKeys = Array.isArray(options.validators?.data)
    ? options.validators?.data
    : options.validators?.data?.$create

  // Schema for creating new entries
  const dataSchema = Type.Pick(
    options.schema,
    dataKeys || [],
    { $id: `${options.schema.$id}Data` }
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Data = Static<typeof dataSchema>
  const dataValidator = getValidator(dataSchema, validatorForData)
  const dataResolver = resolve<TSType, HookContext>(
    options.resolvers?.data?.$create || options.resolvers?.data || {}
  )

  // Schema for updating existing entries
  const patchSchema = Type.Partial(options.schema, {
    $id: `${options.schema.$id}Patch`
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type Patch = Static<typeof patchSchema>
  const patchValidator = getValidator(patchSchema, validatorForData)
  const patchResolver = resolve<TSType, HookContext>(
    options.resolvers?.data?.$patch || options.resolvers?.data || {}
  )

  const queryKeys = ['id', ...(options.validators?.query || [])]

  // Schema for allowed query properties
  const queryProperties = Type.Pick(options.schema, queryKeys)
  const querySchema = Type.Intersect(
    [
      querySyntax(queryProperties),
      // Add additional query properties here
      Type.Object({}, { additionalProperties: false })
    ],
    { additionalProperties: false }
  )
  type Query = Static<typeof querySchema>
  const queryValidator = getValidator(querySchema, validatorForQuery)
  const queryResolver = resolve<Query, HookContext>(
    options.resolvers?.query || {}
  )

  type MyServiceInterface = ServiceInterface<
    TSType,
    Data,
    Params,
    Patch
  >

  const expandHooks = (path: string): HookFunction<Application, MyServiceInterface>[] => {
    const h = get(options.hooks, path)
    if (!h) {
      return []
    }
    return Array.isArray(h) ? h : [h]
  }

  const hooks = {
    around: {
      all: [
        options.authentication
          ? authenticate('jwt')
          : (context: HookContext, next: NextFunction) => next(),
        schemaHooks.resolveExternal(externalResolver),
        schemaHooks.resolveResult(resultResolver),
        ...(options.hooks?.around?.all || []),
      ],
      find: [
        ...(options.hooks?.around?.find || []),
      ],
      get: [
        ...(options.hooks?.around?.get || []),
      ],
      create: [
        ...(options.hooks?.around?.create || []),
      ],
      update: [
        ...(options.hooks?.around?.update || []),
      ],
      patch: [
        ...(options.hooks?.around?.patch || []),
      ],
      remove: [
        ...(options.hooks?.around?.remove || []),
      ],
    },
    before: {
      all: [
        schemaHooks.validateQuery(queryValidator),
        schemaHooks.resolveQuery(queryResolver),
        ...expandHooks('before.all'),
      ],
      find: [
        ...expandHooks('before.find'),
      ],
      get: [
        ...expandHooks('before.get'),
      ],
      create: [
        schemaHooks.validateData(dataValidator),
        schemaHooks.resolveData(dataResolver),
        ...expandHooks('before.create'),
      ],
      update: [
        ...expandHooks('before.update'),
      ],
      patch: [
        schemaHooks.validateData(patchValidator),
        schemaHooks.resolveData(patchResolver),
        ...expandHooks('before.patch'),
      ],
      remove: [
        ...expandHooks('before.remove'),
      ],
    },
    after: {
      all: [
        ...expandHooks('after.all'),
      ],
      find: [
        ...expandHooks('after.find'),
      ],
      get: [
        ...expandHooks('after.get'),
      ],
      create: [
        ...expandHooks('after.create'),
      ],
      update: [
        ...expandHooks('after.update'),
      ],
      patch: [
        ...expandHooks('after.patch'),
      ],
      remove: [
        ...expandHooks('after.remove'),
      ],
    },
    error: {
      all: [
        ...expandHooks('error.all'),
      ],
      find: [
        ...expandHooks('error.find'),
      ],
      get: [
        ...expandHooks('error.get'),
      ],
      create: [
        ...expandHooks('error.create'),
      ],
      update: [
        ...expandHooks('error.update'),
      ],
      patch: [
        ...expandHooks('error.patch'),
      ],
      remove: [
        ...expandHooks('error.remove'),
      ],
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any

  return {
    schemas: {
      main: options.schema,
      create: dataSchema,
      patch: patchSchema,
      query: querySchema,
    },

    validators: {
      create: dataValidator,
      patch: patchValidator,
      query: queryValidator,
    },

    resolvers: {
      create: dataResolver,
      patch: patchResolver,
      query: queryResolver,
    },

    hooks,

    init: (app: Application, _options: AnyData): void => {
      const { paginate, collection } = options

      const o = {
        app,
        paginate: paginate || app.get('paginate'),
        Model: collection
          ? app.get('mongodbClient')
            .then((db: Db) => db.collection(collection))
            .then((collection: Collection) => {
              if (options.indexes) {
                options.indexes.forEach((index) => {
                  collection.createIndex(index.fields, omit(index, ['fields']))
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    .then(() => {})
                })
              }
              return collection
            })
          : undefined,
        ..._options,
      }

      // Initialize our service with any options it requires
      // eslint-disable-next-line new-cap
      app.use(name, new klass(o), {
        methods: options.methods,
        events: [],
      })

      // Get our initialized service so that we can register hooks
      app.service(name)
        .hooks(hooks)
    }
  }
}

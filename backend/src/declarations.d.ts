import {
  AroundHookFunction,
  HookFunction,
  FeathersService,
  HookContext as FeathersHookContext,
  NextFunction,
  PaginationOptions,
} from '@feathersjs/feathers'
import { Application as FeathersApplication, Middleware } from '@feathersjs/koa'
import { TObject } from '@feathersjs/typebox'
import { Index } from '@/shared/schema'
// eslint-disable-next-line import/no-cycle
import { User } from './services/users/users.service'
import { ApplicationConfiguration } from './configuration'

export { NextFunction }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Configuration extends ApplicationConfiguration {}

// A mapping of service names to types. Will be extended in service files.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ServiceTypes {}

// The application instance type that will be used everywhere else
export type Application = FeathersApplication<ServiceTypes, Configuration>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookContext<S = any> = FeathersHookContext<Application, S>

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: User
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = Record<string, any>

export interface CreateServiceValidators {
  data?: string[] | {
    $create?: string[]
    $patch?: string[]
  }
  result?: string[] | {
    $create?: string[]
    $patch?: string[]
  }
  query?: string[]
}

export interface CreateServiceResolvers {
  data?: AnyData
  result?: AnyData
  external?: AnyData
  query?: AnyData
}

export interface CreateServiceHooks {
  all: HookFunction<Application, FeathersService>[]
  get?: HookFunction<Application, FeathersService>[]
  find?: HookFunction<Application, FeathersService>[]
  create?: HookFunction<Application, FeathersService>[]
  update?: HookFunction<Application, FeathersService>[]
  patch?: HookFunction<Application, FeathersService>[]
  remove?: HookFunction<Application, FeathersService>[]
}

export interface CreateServiceAroundHooks {
  all: AroundHookFunction<Application, FeathersService>[]
  get?: AroundHookFunction<Application, FeathersService>[]
  find?: AroundHookFunction<Application, FeathersService>[]
  create?: AroundHookFunction<Application, FeathersService>[]
  update?: AroundHookFunction<Application, FeathersService>[]
  patch?: AroundHookFunction<Application, FeathersService>[]
  remove?: AroundHookFunction<Application, FeathersService>[]
}

export interface CreateServiceHooksMap {
  around?: CreateServiceAroundHooks
  before?: CreateServiceHooks
  after?: CreateServiceHooks
  error?: CreateServiceHooks
}

export interface CreateServiceMongo {
  paginate?: PaginationOptions
  collection: string
}

export interface CreateServiceOptions {
  // TypeBox schema for the service
  schema: TObject
  // hooks for the service
  hooks?: CreateServiceHooksMap
  // pagination options for the service
  paginate?: PaginationOptions
  // mongodb collection name to use
  collection?: string
  // should the user be authenticated to access this service?
  authentication?: boolean
  // supported method names for the service (ex: 'get', 'find', 'create', 'update', 'patch', 'remove')
  methods?: string[]
  // indexes to create
  indexes?: Index[]
  // should we manage createdAt and createdBy fields automatically?
  created?: boolean
  // should we manage updatedAt and updatedBy fields automatically?
  updated?: boolean
  // should we assign the userId when creating
  user?: boolean
  // should we manage deletedAt and deletedBy fields automatically?
  softDelete?: boolean
  // service validators
  validators?: CreateServiceValidators
  // service resolvers
  resolvers?: CreateServiceResolvers
  // service middlewares
  middlewares?: {
    before?: Middleware[]
    after?: Middleware[]
  }
}

export type CreateSchemalessServiceOptions = Omit<CreateServiceOptions, 'schema'>

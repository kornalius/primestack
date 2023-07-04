import {
  AroundHookFunction,
  HookFunction,
  FeathersService,
  HookContext as FeathersHookContext,
  NextFunction,
  PaginationOptions,
} from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { TObject } from '@feathersjs/typebox'
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

export interface Index {
  fields: Record<string, number>
  unique?: boolean
  sparse?: boolean
  expireAfterSeconds?: number
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
  schema: TObject
  hooks?: CreateServiceHooksMap
  paginate?: PaginationOptions
  collection?: string
  authentication?: boolean
  methods?: string[],
  indexes?: Index[]
  created?: boolean
  updated?: boolean
  softDelete?: boolean
  validators?: CreateServiceValidators
  resolvers?: CreateServiceResolvers
}

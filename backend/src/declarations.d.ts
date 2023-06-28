import { HookContext as FeathersHookContext, NextFunction } from '@feathersjs/feathers'
import { Application as FeathersApplication } from '@feathersjs/koa'
import { ApplicationConfiguration } from './configuration'
// import { User } from './services/users/users'

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
// declare module '@feathersjs/feathers' {
//   interface Params {
//     user?: User
//   }
// }

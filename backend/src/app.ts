import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import helmet from 'helmet'
import cors from 'cors'

import { feathers, HookContext as FeathersHookContext } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import express, {
  json, urlencoded, static as staticFiles, rest, notFound
} from '@feathersjs/express'
import socketio from '@feathersjs/socketio'

import { AnyData } from '@/shared/commons'
import { Application } from './declarations'
import { ServiceTypes } from './services/types'

import logger from './logger'
import services from './services'
import appHooks from './app.hooks'
import channels from './channels'

const app: Application = express(feathers<ServiceTypes>())
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HookContext<T = any> = { app: Application } & FeathersHookContext<T>

// Load app configuration
app.configure(configuration())

app.configure(logger)

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(compress())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.use('/', staticFiles(app.get('public')))

// Set up Plugins and providers
app.configure(rest())

app.configure(socketio({
  path: `/${app.get('wsPath')}/`
}, (io) => {
  io.sockets.setMaxListeners(app.get('socketsListeners') || 255)
  io.use((socket, next) => {
    // eslint-disable-next-line no-param-reassign
    (socket as AnyData).feathers.appId = socket.handshake.query.appId
    next()
  })
}))

// Set up our services (see `services/composites.ts`)
app.configure(services)
// Set up event channels (see channels.ts)
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())

app.hooks(appHooks)

setTimeout(async () => {
  app.get('log')({
    level: 'info',
    message: `Running in ${app.get('env') || 'development'} mode`
  })
}, 1000)

export default app

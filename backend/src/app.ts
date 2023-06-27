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

app.get('log')({ level: 'info', message: 'Setting up Express middlewares...' })

// Enable security, CORS, compression, favicon and body parsing
app.get('log')({ level: 'info', message: '  - Secure HTTP headers' })
app.use(helmet({ contentSecurityPolicy: false }))
app.get('log')({ level: 'info', message: '  - CORS' })
app.use(cors())
app.get('log')({ level: 'info', message: '  - Compression' })
app.use(compress())
app.get('log')({ level: 'info', message: '  - JSON payload' })
app.use(json())
app.get('log')({ level: 'info', message: '  - URL encoded payload' })
app.use(urlencoded({ extended: true }))
app.get('log')({ level: 'info', message: '  - Favicon' })
app.use(favicon(path.join(app.get('public'), 'favicon.ico')))
// Host the public folder
app.get('log')({ level: 'info', message: '  - Public folder' })
app.use('/', staticFiles(app.get('public')))

// Set up Plugins and providers
app.get('log')({ level: 'info', message: '  - REST' })
app.configure(rest())

app.get('log')({
  level: 'info',
  message: `Setting up socketio on path /${app.get('wsPath')}/ \
with ${app.get('socketsListeners') || 255} listeners...`
})
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

app.get('log')({ level: 'info', message: 'Setting up Feathers...' })

// Set up our services
app.get('log')({ level: 'info', message: '  - services' })
app.configure(services)
// Set up event channels (see channels.ts)
app.get('log')({ level: 'info', message: '  - channels' })
app.configure(channels)

// Configure a middleware for 404s and the error handler
app.use(notFound())

app.get('log')({ level: 'info', message: '  - global hooks' })
app.hooks(appHooks)

setTimeout(async () => {
  app.get('log')({
    level: 'info',
    message: `Running in ${app.get('env') || 'development'} mode`
  })
}, 1000)

export default app

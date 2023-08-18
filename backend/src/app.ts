import {
  koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic, Koa,
} from '@feathersjs/koa'
import path from 'path'
import { feathers } from '@feathersjs/feathers'
import { FeathersKoaContext } from '@feathersjs/koa/src/declarations'
import configuration from '@feathersjs/configuration'
import socketio from '@feathersjs/socketio'
import { AnyData } from '@/shared/interfaces/commons'
import { Application, ServiceTypes } from './declarations'
import { configurationValidator } from './configuration'
import logger, { info } from './logger'
import services from './services'
import appHooks from './app.hooks'
import { authentication } from './authentication'
import channels from './channels'
import mongodb from './mongodb'

const app: Application = koa(feathers<ServiceTypes>())

// Load app configuration
app.configure(configuration(configurationValidator))

// Setting up Winston logger
app.configure(logger)

info('Setting up Koa...')

info('  - CORS')
app.use(cors())

info('  - Public folder')
app.use(serveStatic(app.get('public')))

info('  - Error handler')
app.use(errorHandler())

info('  - Authentication parser')
app.use(parseAuthentication())

const storagePath = path.resolve(app.get('uploadsPath') as string)

info('  - JSON/Files payload parser')
app.use(bodyParser({
  formidable: {
    uploadDir: storagePath,
    allowEmptyFiles: false,
    keepExtensions: true,
  },
  multipart: true,
  urlencoded: true,
}))

// another middleware, this time to transfer the received files to feathers
app.use(async (ctx: FeathersKoaContext, next: Koa.Next) => {
  ctx.feathers = {
    ...ctx.feathers,
    file: ctx.request.files?.file,
  } as AnyData
  await next()
})

info('  - REST')
app.configure(rest())

info(`Setting up socketio on path "${app.get('wsPath')}/" \
with ${app.get('socketsListeners') || 255} listeners...`)
app.configure(
  socketio({
    path: `/${app.get('wsPath')}/`,
    cors: {
      origin: app.get('origins')
    }
  }, (io) => {
    io.sockets.setMaxListeners(app.get('socketsListeners') || 255)
    // io.use((socket, next) => {
    //   // eslint-disable-next-line no-param-reassign
    //   (socket as AnyData).feathers.appId = socket.handshake.query.appId
    //   next()
    // })
  })
)

info('Setting up MongoDB...')
app.configure(mongodb)

info('Setting up Authentication...')
app.configure(authentication)

info('Setting up Feathers...')

info('  - services')
app.configure(services)

info('  - channels')
app.configure(channels)

info('  - global hooks')
app.configure(appHooks)

info(`Running in ${app.get('env') || 'development'} mode`)

export default app

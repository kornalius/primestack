import { feathers, HookContext } from '@feathersjs/feathers'
import { stripSlashes } from '@feathersjs/commons'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { getEnv } from './utils/variables'

const API_URL = getEnv(import.meta.env.VITE_API_URL) as string
const API_PATH = getEnv(import.meta.env.VITE_API_PATH) as string
const WS_PATH = getEnv(import.meta.env.VITE_WS_PATH) as string
const SOCKET_TIMEOUT = getEnv(import.meta.env.VITE_SOCKET_TIMEOUT, '30000')

if (import.meta.env.NODE_ENV === 'production' && !API_URL) {
  throw Error('VITE_API_URL is not set')
}

const host = API_URL || 'http://localhost:3030/'

const socket = io(host, {
  path: `${API_PATH
    ? `/${API_PATH}`
    : ''}/${WS_PATH}/`,
  transports: ['websocket'],
  query: {},
})

export const hooks = {
  authentication() {
    return (context: HookContext): Promise<HookContext> | HookContext => {
      const {
        app,
        params,
        path,
        method,
        app: { authentication: service },
      } = context

      if (stripSlashes(service.options.path) === path && method === 'create') {
        return context
      }

      return Promise.resolve(app.get('authentication')).then((authResult) => {
        if (authResult) {
          // eslint-disable-next-line no-param-reassign
          context.params = { ...authResult, ...params }
        }

        return context
      })
    }
  },

  populateHeader() {
    return (context: HookContext): HookContext => {
      const { app, params: { token } } = context
      const { authentication } = app

      // Set REST header if necessary
      if (app.rest && token) {
        const { scheme, header } = authentication.options
        const authHeader = `${scheme} ${token}`

        // eslint-disable-next-line no-param-reassign
        context.params.headers = {
          [header]: authHeader,
          ...context.params.headers,
        }
      }

      return context
    }
  },
}

export const feathersClient = feathers()
  .configure(socketio(socket, { timeout: SOCKET_TIMEOUT }))
  .hooks({
    before: {
      all: [
        hooks.authentication(),
        hooks.populateHeader(),
      ],
    },
    error: {
      all: [(context: HookContext) => errorHandler(context)],
    },
  })

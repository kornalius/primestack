import { feathers, HookContext } from '@feathersjs/feathers'
import { stripSlashes } from '@feathersjs/commons'
import socketio from '@feathersjs/socketio-client'
import io from 'socket.io-client'
import { GeneralError, NotFound } from '@feathersjs/errors'
import useSnacks from '@/features/Snacks/composites'
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

const errorHandler = (context: HookContext): HookContext => {
  const snacks = useSnacks()

  const { error } = context

  if (!error) {
    return context
  }

  // Logout errors should be eaten
  if (context.error.code === 401 && context.method === 'remove') {
    return context
  }

  // Will display original errors in the console only
  // if (skipErrorSnacks()) {
  //   // eslint-disable-next-line no-console
  //   console.error(error)
  //   return context
  // }

  const pushSnack = (err) => {
    snacks.push({
      ...err,
      level: 'Error',
    })
  }

  if (error) {
    if (!error.code) {
      pushSnack({
        ...context,
        error: new GeneralError('server error'),
      })
      return context
    }

    let err
    let message = ''

    switch (error.code) {
      case 408:
        message = 'Server timeout!'
        err = new GeneralError(message)
        break

      case 404:
        message = `Could not ${error.hook?.method} resource with ID ${error.hook?.id}`
        err = new NotFound(message)
        break

      default:
        err = new GeneralError(error)
    }

    pushSnack(err)
  }

  return context
}

export const feathersClient = feathers()
  .configure(socketio(socket, { timeout: SOCKET_TIMEOUT }))
  .hooks({
    before: {
      all: [
        // hooks.authentication(),
        // hooks.populateHeader(),
      ],
    },
    error: {
      all: [(context: HookContext) => errorHandler(context)],
    },
  })

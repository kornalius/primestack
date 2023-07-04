import { authenticate } from '@feathersjs/authentication'
import { Application } from '@feathersjs/koa'
import { Type, Static } from '@feathersjs/typebox'
import { HookContext } from '@feathersjs/feathers'
import { AnyData } from '@/shared/commons'
import { passwordHash } from '@feathersjs/authentication-local'
// eslint-disable-next-line import/no-cycle
import { createService, MongoService } from '../../service'

const path = 'users'

class Service extends MongoService {}

const service = createService('users', Service, {
  collection: 'users',
  schema: Type.Object(
    {
      id: Type.String({ objectid: true }),
      email: Type.String({ format: 'email' }),
      password: Type.Optional(Type.String()),
      googleId: Type.Optional(Type.String()),
      facebookId: Type.Optional(Type.String()),
      twitterId: Type.Optional(Type.String()),
      githubId: Type.Optional(Type.String()),
      auth0Id: Type.Optional(Type.String())
    },
    { $id: 'User', additionalProperties: false }
  ),
  methods: ['find', 'get', 'create', 'patch', 'remove'],
  validators: {
    data: ['email', 'password', 'googleId', 'facebookId', 'twitterId', 'githubId', 'auth0Id'],
    query: ['email', 'password', 'googleId', 'facebookId', 'twitterId', 'githubId', 'auth0Id'],
  },
  resolvers: {
    external: {
      password: async () => undefined
    },
    data: {
      $create: {
        password: passwordHash({ strategy: 'local' })
      },
      $update: {
        password: passwordHash({ strategy: 'local' })
      },
    },
    query: {
      id: async (value: AnyData, user: AnyData, context: HookContext) => {
        if (context.params.user) {
          // eslint-disable-next-line no-underscore-dangle
          return context.params.user._id
        }
        return value
      }
    }
  },
  indexes: [
    {
      fields: { email: 1 },
      unique: true,
    }
  ],
  hooks: {
    around: {
      all: [],
      find: [authenticate('jwt')],
      get: [authenticate('jwt')],
      create: [],
      update: [authenticate('jwt')],
      patch: [authenticate('jwt')],
      remove: [authenticate('jwt')]
    }
  }
})

export default function (app: Application): void {
  service.init(app, {})
}

export type User = Static<typeof service.schemas.main>

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    [path]: Service
  }
}
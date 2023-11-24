import {
  Type, Static, getValidator, defaultAppConfiguration,
} from '@feathersjs/typebox'
// eslint-disable-next-line import/no-cycle
import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    env: Type.String(),
    prefix: Type.String(),
    host: Type.String(),
    port: Type.Number(),
    public: Type.String(),
    uploadsPath: Type.String(),
    debug: Type.Optional(Type.String()),
    socketsListeners: Type.Optional(Type.Number()),
    wsPath: Type.Optional(Type.String()),
    adminEmail: Type.Optional(Type.String()),
    adminPwd: Type.Optional(Type.String()),
    adminFirstname: Type.Optional(Type.String()),
    adminLastname: Type.Optional(Type.String()),
    testUserEmail: Type.Optional(Type.String()),
    testUserPwd: Type.Optional(Type.String()),
    testUserFirstname: Type.Optional(Type.String()),
    testUserLastname: Type.Optional(Type.String()),
    locale: Type.Optional(Type.String()),
    fallbackLocale: Type.Optional(Type.String()),
    email: Type.Optional(Type.Object({
      service: Type.String(),
      host: Type.String(),
      port: Type.Number(),
      secure: Type.Boolean(),
      sender: Type.String(),
      user: Type.String(),
      pwd: Type.String(),
    })),
  }),
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)

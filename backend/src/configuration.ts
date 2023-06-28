import { Type, getValidator, defaultAppConfiguration } from '@feathersjs/typebox'
import type { Static } from '@feathersjs/typebox'

import { dataValidator } from './validators'

export const configurationSchema = Type.Intersect([
  defaultAppConfiguration,
  Type.Object({
    env: Type.String(),
    host: Type.String(),
    port: Type.Number(),
    public: Type.String(),
    debug: Type.Optional(Type.String()),
    socketsListeners: Type.Optional(Type.Number()),
    wsPath: Type.Optional(Type.String()),
  }),
])

export type ApplicationConfiguration = Static<typeof configurationSchema>

export const configurationValidator = getValidator(configurationSchema, dataValidator)

import { Type } from '@feathersjs/typebox'
import { maxSchema, schema as ruleSchema } from './rule'

export const schema = Type.Intersect([
  Type.Object({
    _id: Type.String({ objectid: true }),
    email: Type.String({ format: 'email' }),
    password: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    firstname: Type.Optional(Type.String()),
    lastname: Type.Optional(Type.String()),
    googleId: Type.Optional(Type.String()),
    facebookId: Type.Optional(Type.String()),
    twitterId: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
    planId: Type.Optional(Type.String({ objectid: true, service: 'plans' })),
    _plan: Type.Optional(Type.Object({})),
    groupId: Type.Optional(Type.String({ objectid: true, service: 'groups' })),
    _group: Type.Optional(Type.Object({})),
    rules: Type.Array(ruleSchema),
  }),
  maxSchema,
], { $id: 'User', additionalProperties: false })

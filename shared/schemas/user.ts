import { Type } from '@feathersjs/typebox'
import { maxSchema, schema as ruleSchema } from './rule'
import ExType from '../extypes'

export const schema = Type.Intersect([
  Type.Object({
    _id: ExType.Id(),
    email: ExType.Email(),
    password: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    firstname: Type.Optional(Type.String()),
    lastname: Type.Optional(Type.String()),
    googleId: Type.Optional(Type.String()),
    facebookId: Type.Optional(Type.String()),
    twitterId: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
    planId: Type.Optional(ExType.Id({ service: 'plans' })),
    _plan: Type.Optional(Type.Object({})),
    groupId: Type.Optional(ExType.Id({ service: 'groups' })),
    _group: Type.Optional(Type.Object({})),
    rules: Type.Array(ruleSchema),
    settings: Type.Object({}, { additionalProperties: true }),
    sidebars: Type.Object({}, { additionalProperties: true }),
    locale: Type.Optional(Type.String()),
  }),
  maxSchema,
], { $id: 'User', additionalProperties: false })

import { Type } from '@feathersjs/typebox'

export const schema = Type.Object(
  {
    _id: Type.String({ objectid: true }),
    email: Type.String({ format: 'email' }),
    password: Type.Optional(Type.String()),
    googleId: Type.Optional(Type.String()),
    facebookId: Type.Optional(Type.String()),
    twitterId: Type.Optional(Type.String()),
    githubId: Type.Optional(Type.String()),
    auth0Id: Type.Optional(Type.String()),
  },
  { $id: 'User', additionalProperties: false }
)

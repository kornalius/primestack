import { Type } from '@feathersjs/typebox'
import { schema as ruleSchema } from './rule'
import ExType from '../extypes'

export const schema = Type.Object(
  {
    _id: ExType.Id(),
    // target userId
    userId: ExType.Id(),
    // target email if not registered
    email: Type.String({ email: true }),
    // menuId to share
    menuId: ExType.Id(),
    // rules for tables
    rules: Type.Array(ruleSchema),
    // is the share disabled?
    disabled: Type.Boolean(),
    // the share is only valid from this date
    validFrom: Type.Optional(ExType.Date()),
    // the share is only valid until this time
    validUntil: Type.Optional(ExType.Date()),
    // timestamp the share email was sent
    emailSent: Type.Optional(Type.Number()),
    // user wants the email resent
    emailResend: Type.Optional(Type.Boolean()),
    // when the user shared with clicks the email link (navigate to /share-link/...)
    emailClicked: Type.Optional(Type.Number()),

    // from resolvers
    formIds: Type.Optional(Type.Array(ExType.Id())),
    tableIds: Type.Optional(Type.Array(ExType.Id())),
  },
  { $id: 'Share', additionalProperties: false },
)

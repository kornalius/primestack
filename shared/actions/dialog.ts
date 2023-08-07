import { Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import { sizeString } from '../interfaces/commons'

export default {
  type: 'dialog',
  label: 'Dialog',
  description: 'Display confirmation dialog',
  schema: Type.Object({
    title: Type.String(),
    message: Type.String(),
    ok: Type.Object({
      hidden: Type.Boolean(),
      label: Type.Optional(Type.String()),
      noCaps: Type.Optional(Type.Boolean()),
      color: Type.Optional(Type.String({ color: true })),
      textColor: Type.Optional(Type.String({ color: true })),
      icon: Type.Optional(Type.String({ icon: true })),
      iconRight: Type.Optional(Type.String({ icon: true })),
      size: Type.Optional(sizeString),
      outline: Type.Optional(Type.Boolean()),
      unelevated: Type.Optional(Type.Boolean()),
      rounded: Type.Optional(Type.Boolean()),
      round: Type.Optional(Type.Boolean()),
      square: Type.Optional(Type.Boolean()),
      flat: Type.Optional(Type.Boolean()),
    }, { horizontalPopup: true }),
    cancel: Type.Object({
      hidden: Type.Boolean(),
      label: Type.Optional(Type.String()),
      noCaps: Type.Optional(Type.Boolean()),
      color: Type.Optional(Type.String({ color: true })),
      textColor: Type.Optional(Type.String({ color: true })),
      icon: Type.Optional(Type.String({ icon: true })),
      iconRight: Type.Optional(Type.String({ icon: true })),
      size: Type.Optional(sizeString),
      outline: Type.Optional(Type.Boolean()),
      unelevated: Type.Optional(Type.Boolean()),
      rounded: Type.Optional(Type.Boolean()),
      round: Type.Optional(Type.Boolean()),
      square: Type.Optional(Type.Boolean()),
      flat: Type.Optional(Type.Boolean()),
    }, { horizontalPopup: true }),
  }),
  acceptsChildren: true,
} as TAction

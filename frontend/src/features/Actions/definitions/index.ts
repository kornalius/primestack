import { Static } from '@feathersjs/typebox'
import { actionElementSchema } from '@/shared/schemas/actions'
import patch from './patch'
import remove from './remove'
import dialog from './dialog'
import notify from './notify'

export const actions = [
  dialog,
  notify,
  patch,
  remove,
]

type Action = Static<typeof actionElementSchema>

export const actionsByType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a }
  ), {})
)

const componentForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.component }
  ), {})
)

export const componentForAction = (action: Action): unknown => {
  // eslint-disable-next-line no-underscore-dangle
  let comp = componentForType[action._type]
  if (typeof comp === 'function') {
    comp = comp(action)
  }
  return comp
}

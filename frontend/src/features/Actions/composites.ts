import omit from 'lodash/omit'
import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
// eslint-disable-next-line import/no-cycle
import { actions } from './definitions'

type ActionElement = Static<typeof actionElementSchema>

type Action = Static<typeof actionElementSchema>

const actionsByType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a }
  ), {})
)

const componentForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.component }
  ), {})
)

const execForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.exec }
  ), {})
)

const execAction = (a: ActionElement, args: AnyData) => {
  // eslint-disable-next-line no-underscore-dangle
  const exec = execForType[a._type]
  exec({ ...args, ...omit(a, ['_id', '_type']) })
}

const exec = (list: ActionElement[], args: AnyData) => {
  list.forEach((a) => {
    execAction(a, args)
  })
}

const componentForAction = (action: Action): unknown => {
  // eslint-disable-next-line no-underscore-dangle
  let comp = componentForType[action._type]
  if (typeof comp === 'function') {
    comp = comp(action)
  }
  return comp
}

const flattenActions = (acts: ActionElement[]): ActionElement[] => {
  const flattended: ActionElement[] = []

  const flatten = (list: ActionElement[]): void => {
    list.forEach((a) => {
      flattended.push(a)

      // eslint-disable-next-line no-underscore-dangle
      const children = a._children
      if (children) {
        flatten(children)
      }
    })
  }

  flatten(acts)

  return flattended
}

export default () => ({
  componentForAction,

  actionsByType,

  componentForType,

  execForType,

  actions,

  flattenActions,

  actionBinds: (action: ActionElement): AnyData => {
    const fieldsToOmit = [
      '_id',
      '_type',
      '_children',
    ]
    return omit(action, fieldsToOmit)
  },

  exec,
})

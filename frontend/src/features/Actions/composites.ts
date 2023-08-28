import omit from 'lodash/omit'
import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
import { fieldSchema } from '@/shared/actions/insert'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
// eslint-disable-next-line import/no-cycle
import { actions } from './definitions'

type ActionElement = Static<typeof actionElementSchema>

type Action = Static<typeof actionElementSchema>

type Field = Static<typeof fieldSchema>

export const actionsByType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a }
  ), {})
)

export const componentForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.component }
  ), {})
)

export const execForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.exec }
  ), {})
)

export const execAction = async (a: ActionElement, args: AnyData) => {
  // eslint-disable-next-line no-underscore-dangle
  const exec = execForType[a._type]
  await exec({ ...args, ...omit(a, ['_id', '_type']) })
}

export const exec = async (list: ActionElement[], args: AnyData) => (
  Promise.all(list.map((a) => execAction(a, args)))
)

export const componentForAction = (action: Action): unknown => {
  // eslint-disable-next-line no-underscore-dangle
  let comp = componentForType[action._type]
  if (typeof comp === 'function') {
    comp = comp(action)
  }
  return comp
}

export const flattenActions = (acts: ActionElement[]): ActionElement[] => {
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

export const useActions = () => ({
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

  fieldsArrayToObject: (fields: Field[], ctx: AnyData): AnyData => (
    fields.reduce((acc, f) => (
      { ...acc, [f.name]: getProp(f.value, ctx) }
    ), {})
  ),

  exec,
})

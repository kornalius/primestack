import omit from 'lodash/omit'
import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { actionElementSchema } from '@/shared/schemas/actions'
import { fieldSchema } from '@/shared/actions/insert'
// eslint-disable-next-line import/no-cycle
import { getProp } from '@/features/Expression/composites'
import { useVariables } from '@/features/Variables/store'
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
  const aa = Object.keys(omit(a, ['_id', '_type', '$scoped'])).reduce((acc, k) => ({
    ...acc,
    [k]: getProp(a[k], args),
  }), {})
  await exec({ ...args, ...aa, ...args.$scoped })
}

export const exec = async (list: ActionElement[], args: AnyData) => {
  const variables = useVariables()
  const old = variables.getRaw('_scoped')
  variables.setRaw('_scoped', args.$scoped)
  const r = Promise.all(list.map((a) => execAction(a, args)))
  variables.setRaw('_scoped', old)
  return r
}

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

export const fieldsArrayToObject = (fields: Field[], ctx: AnyData): AnyData => (
  fields.reduce((acc, f) => (
    { ...acc, [f.name]: getProp(f.value, ctx) }
  ), {})
)

export const actionBinds = (action: ActionElement): AnyData => {
  const fieldsToOmit = [
    '_id',
    '_type',
    '_children',
  ]
  return omit(action, fieldsToOmit)
}

export const useActions = () => ({
  componentForAction,

  actionsByType,

  componentForType,

  execForType,

  actions,

  flattenActions,

  actionBinds,

  fieldsArrayToObject,

  exec,
})

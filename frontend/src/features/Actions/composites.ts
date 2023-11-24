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
type ActionField = Static<typeof fieldSchema>

/**
 * Object of [type]: action
 */
export const actionsByType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a }
  ), {})
)

/**
 * Object of [type]: Vue Component
 */
export const componentForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.component }
  ), {})
)

/**
 * Object of [type]: Exec functions
 */
export const execForType = (
  actions.reduce((acc, a) => (
    { ...acc, [a.type]: a.exec }
  ), {})
)

/**
 * Execute an action 'exec' function
 *
 * @param a Action instance
 * @param args Context arguments
 *
 * @returns {Promise<AnyData>}
 */
export const execAction = async (a: ActionElement, args: AnyData): Promise<AnyData> => {
  // eslint-disable-next-line no-underscore-dangle
  const actionExec = execForType[a._type]
  const actionArgs = Object.keys(omit(a, ['_id', '_type', '_internalType', '$scoped']))
    .reduce((acc, k) => ({
      ...acc,
      [k]: getProp(a[k], args),
    }), {})
  return actionExec({ ...args, ...actionArgs, ...args.$scoped })
}

/**
 * Execute a list of actions
 *
 * @param list Array of actions
 * @param args Context arguments
 *
 * @returns {Promise<AnyData[]>}
 */
export const exec = async (list: ActionElement[], args: AnyData): Promise<void> => {
  const variables = useVariables()
  const oldPrevResult = variables.getRaw('_prevResult')
  const old = variables.getRaw('_scoped')
  variables.setRaw('_scoped', args.$scoped)
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    // eslint-disable-next-line no-await-in-loop
    const res = await execAction(a, args)
    if (res !== undefined) {
      variables.setRaw('_prevResult', res)
    }
  }
  variables.setRaw('_scoped', old)
  variables.setRaw('_prevResult', oldPrevResult)
}

/**
 * Returns the Vue component associated with the action
 *
 * @param action Action instance
 *
 * @returns {unknown}
 */
export const componentForAction = (action: Action): unknown => {
  // eslint-disable-next-line no-underscore-dangle
  let comp = componentForType[action._type]
  if (typeof comp === 'function') {
    comp = comp(action)
  }
  return comp
}

/**
 * Flatten all actions into a flat array
 *
 * @param acts Array of actions
 *
 * @returns {ActionElement[]}
 */
export const flattenActions = (acts?: ActionElement[]): ActionElement[] => {
  const flattened: ActionElement[] = []

  const flatten = (list: ActionElement[]): void => {
    (list || []).forEach((a) => {
      flattened.push(a)

      // eslint-disable-next-line no-underscore-dangle
      const children = a._children
      if (children) {
        flatten(children)
      }
    })
  }

  flatten(acts)

  return flattened
}

/**
 * Converts an array of fields + values (from properties) into an object to pass to mongo
 * Also evaluates the expressions inside the values
 *
 * @param fields Array of fields
 * @param ctx Context object
 *
 * @returns {AnyData}
 */
export const fieldsArrayToObject = (fields: ActionField[], ctx: AnyData): AnyData => (
  fields.reduce((acc, f) => (
    { ...acc, [f.name]: getProp(f.value, ctx) }
  ), {})
)

/**
 * Binds actions arguments to a Vue Component (v-bind)
 *
 * @param action Action instance
 *
 * @returns {AnyData}
 */
export const actionBinds = (action: ActionElement): AnyData => {
  const fieldsToOmit = [
    '_id',
    '_type',
    '_internalType',
    '_children',
  ]
  return omit(action, fieldsToOmit)
}

/**
 * Finds the parent action of an action
 *
 * @param acts Actions array
 * @param act Action
 *
 * @returns {ActionElement|undefined}
 */
export const parentAction = (acts: ActionElement[], act: ActionElement): ActionElement | undefined => (
  flattenActions(acts)
    .find((a) => (
      // eslint-disable-next-line no-underscore-dangle
      a._children.find((c) => c._id === act._id)
    ))
)

/**
 * Computes the results for an array of actions
 *
 * @param acts Array of Actions
 * @param uptoAction Compute until you reach this action
 * @param ctx Context
 *
 * @returns {string[]}
 */
export const computeActionResults = (
  acts: ActionElement[],
  uptoAction: ActionElement,
  ctx: AnyData,
): string[] => {
  let prevResult = []
  for (let i = 0; i < acts.length; i++) {
    const a = acts[i]
    if (a === uptoAction) {
      return prevResult
    }
    // eslint-disable-next-line no-underscore-dangle
    const action = actionsByType[a._type]
    prevResult = typeof action.result === 'function'
      ? action.result({ ...ctx, ...actionBinds(a) }, prevResult)
      : prevResult
  }
  return prevResult
}

/**
 * Returns the action before this action
 *
 * @param acts Array of actions
 * @param a Action instance
 *
 * @returns {ActionElement|undefined}
 */
export const actionBefore = (acts: ActionElement[], a: ActionElement): ActionElement | undefined => {
  const parent = parentAction(acts, a)
  // eslint-disable-next-line no-underscore-dangle
  const list = parent?._children || acts
  const idx = list.findIndex((ac) => ac._id === a._id)
  if (idx !== -1 && idx - 1 >= 0) {
    return list?.[idx - 1]
  }
  return undefined
}

/**
 * Returns the action after this action
 *
 * @param acts Array of actions
 * @param a Action instance
 *
 * @returns {ActionElement|undefined}
 */
export const actionAfter = (acts: ActionElement[], a: ActionElement): ActionElement | undefined => {
  const parent = parentAction(acts, a)
  // eslint-disable-next-line no-underscore-dangle
  const list = parent?._children || acts
  const idx = list.findIndex((ac) => ac._id === a._id)
  if (idx !== -1 && idx + 1 < list.length) {
    return list?.[idx + 1]
  }
  return undefined
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

  parentAction,

  computeActionResults,

  actionBefore,

  actionAfter,
})

import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { actionElementSchema, actionSchema } from '@/shared/schemas/actions'
// eslint-disable-next-line import/no-cycle
import { flattenActions } from '@/features/Actions/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { TAction } from '@/shared/interfaces/actions'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import cloneDeep from 'lodash/cloneDeep'

type Action = Static<typeof actionSchema>
type ActionElement = Static<typeof actionElementSchema>

export const useActionEditor = defineStore('action-editor', () => {
  const states = ref({
    // id of action being edited
    actionId: undefined,
    // name of action event being edited
    actionEvent: undefined,
    // actions being edited
    actions: [] as Action[],
  })

  /**
   * Selected action id
   */
  const actionId = computed(() => states.value.actionId)

  /**
   * Selected action event name
   */
  const actionEvent = computed(() => states.value.actionEvent)

  /**
   * Clone of the user's actions
   */
  const actions = computed(() => states.value.actions)

  /**
   * Sets the cloned actions
   *
   * @param list
   */
  const setActions = (list: Action[]) => {
    states.value.actions = list
  }

  /**
   * Get the instance of an action by its id
   *
   * @param id Id of the action
   *
   * @returns {Action|undefined} Action instance from the id
   */
  const instance = (id: string): Action | undefined => (
    states.value.actions.find((a) => a._id === id)
  )

  /**
   * Get the instance of an action element by its id
   *
   * @param id Id of the action element
   *
   * @returns {ActionElement|undefined} ActionElement instance from the id
   */
  const actionElementInstance = (id: string): ActionElement | undefined => {
    const currentAction = instance(states.value.actionId)
    // eslint-disable-next-line no-underscore-dangle
    return flattenActions(currentAction?._actions)
      .find((a) => a._id === id)
  }

  /**
   * Sets the current action id being edited
   * @param id
   */
  const setActionId = (id: string): void => {
    states.value.actionId = id
  }

  /**
   * Sets the current action event name being edited
   *
   * @param name Name of the event
   */
  const setActionEvent = (name: string): void => {
    states.value.actionEvent = name
  }

  /**
   * Creates a new action
   *
   * @param options Options to add to the action
   *
   * @returns {Action} New action
   */
  const add = (options: AnyData): Action => {
    const a: Action = {
      _id: hexObjectId(),
      _internalType: 'action',
      _actions: [],
      ...options,
    }
    states.value.actions = [...states.value.actions, a]
    return a
  }

  /**
   * Removes an action
   *
   * @param id Id of the action to remove
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string): boolean => {
    const idx = states.value.actions
      .findIndex((a) => a._id === id)
    if (idx !== -1) {
      states.value.actions = [
        ...states.value.actions.slice(0, idx),
        ...states.value.actions.slice(idx + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Creates a new action element
   *
   * @param action Action type to derive the action element from
   * @param options Options to add to the action element
   *
   * @returns {ActionElement} New action element
   */
  const createActionElement = (action: TAction, options?: AnyData): ActionElement => ({
    _id: hexObjectId(),
    _internalType: 'action-element',
    _type: action.type,
    _children: [],
    ...Object.keys(action.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(action.schema.properties[k]) }
      ), {}),
    ...(defaultValues(action.defaultValues) || {}),
    ...(options || {}),
  })

  /**
   * Adds a new action element
   *
   * @param action Action type for the element
   * @param options Options to add to the element
   *
   * @returns {ActionElement} New action element instance
   */
  const addActionElement = (action: TAction, options?: AnyData): ActionElement => {
    const currentAction = instance(states.value.actionId)
    const a: ActionElement = createActionElement(action, options)
    // eslint-disable-next-line no-underscore-dangle
    currentAction._actions.push(a)
    return a
  }

  /**
   * Removes an action element
   *
   * @param id Id of the action element to remove
   * @param action Action to remove the action element from
   *
   * @returns {boolean} True is successful
   */
  const removeActionElement = (id: string, action: Action): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const index = action._actions
      .findIndex((a) => a._id === id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      action._actions = [
        // eslint-disable-next-line no-underscore-dangle
        ...action._actions.slice(0, index),
        // eslint-disable-next-line no-underscore-dangle
        ...action._actions.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Duplicates an action
   *
   * @param action Action instance to duplicate
   *
   * @returns {Action} New action
   */
  const duplicate = (action: Action): Action => {
    const a: Action = {
      ...cloneDeep(action),
      _id: hexObjectId(),
    }
    states.value.actions = [...states.value.actions, a]
    return a
  }

  /**
   * Duplicates an action element
   *
   * @param actionElement Action instance element to duplicate
   * @param action Action instance to duplicate into
   *
   * @returns {ActionElement} New action element
   */
  const duplicateActionElement = (actionElement: ActionElement, action: Action): ActionElement => {
    const e: ActionElement = {
      ...cloneDeep(actionElement),
      _id: hexObjectId(),
    }
    // eslint-disable-next-line no-underscore-dangle
    action._actions.push(e)
    return e
  }

  return {
    states,
    actionId,
    actionEvent,
    actions,
    setActions,
    setActionId,
    setActionEvent,
    instance,
    actionElementInstance,
    add,
    duplicate,
    remove,
    createActionElement,
    addActionElement,
    duplicateActionElement,
    removeActionElement,
  }
})

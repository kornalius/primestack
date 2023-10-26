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

type Action = Static<typeof actionSchema>
type ActionElement = Static<typeof actionElementSchema>

export const useActionEditor = defineStore('action-editor', () => {
  const states = ref({
    // id of action being edited
    actionId: undefined,
    // name of action event being edited
    actionEvent: undefined,
    // selected action element id
    selectedActionElement: undefined,
    // actions being edited
    actions: [] as Action[],
  })

  /**
   * Selected action element id
   */
  const selectedActionElement = computed(() => states.value.selectedActionElement)

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
    if (!currentAction) {
      return undefined
    }
    // eslint-disable-next-line no-underscore-dangle
    return flattenActions(currentAction._actions)
      .find((a) => a._id === id)
  }

  /**
   * Selects a action element
   *
   * @param id Id of the action element
   */
  const selectActionElement = (id: string): boolean => {
    states.value.selectedActionElement = id
    return true
  }

  /**
   * Unselects currently selected action element
   */
  const unselectActionElement = (): boolean => {
    states.value.selectedActionElement = undefined
    return true
  }

  /**
   * Sets the current action id being edited
   * @param id
   */
  const setActionId = (id: string): void => {
    states.value.actionId = id
    const a = instance(id)
    if (a) {
      // eslint-disable-next-line no-underscore-dangle
      selectActionElement(a._actions?.[0]?._id)
    }
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
   * Checks to see if a action element is being selected or not
   *
   * @param id Id of the action element
   *
   * @returns {boolean} True if the action element is selected
   */
  const isActionElementSelected = (id: string): boolean => (
    states.value.selectedActionElement === id
  )

  /**
   * Creates a new action
   *
   * @param options Options to add to the action
   * @param selectIt Should we select it?
   *
   * @returns {Action} New action
   */
  const add = (options: AnyData, selectIt?: boolean): Action => {
    const a: Action = {
      _id: hexObjectId(),
      _actions: [],
      ...options,
    }
    states.value.actions = [...states.value.actions, a]
    if (selectIt) {
      setActionId(a._id)
    }
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
   * @param selectIt Should we select it?
   *
   * @returns {ActionElement} New action element instance
   */
  const addActionElement = (action: TAction, selectIt?: boolean): ActionElement => {
    const currentAction = instance(states.value.actionId)

    const a: ActionElement = {
      _id: hexObjectId(),
      _type: action.type,
      _children: [],
      ...action.defaultValues,
    }
    // eslint-disable-next-line no-underscore-dangle
    currentAction._actions.push(a)
    if (selectIt) {
      setTimeout(() => {
        selectActionElement(a._id)
      }, 100)
    }
    return a
  }

  /**
   * Removes an action element
   *
   * @param id Id of the action element to remove
   *
   * @returns {boolean} True is successful
   */
  const removeActionElement = (id: string): boolean => {
    const currentAction = instance(states.value.actionId)
    // eslint-disable-next-line no-underscore-dangle
    const index = currentAction._actions
      .findIndex((a) => a._id === id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle
      currentAction._actions = [
        // eslint-disable-next-line no-underscore-dangle
        ...currentAction._actions.slice(0, index),
        // eslint-disable-next-line no-underscore-dangle
        ...currentAction._actions.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
    states,
    selectedActionElement,
    actionId,
    actionEvent,
    actions,
    setActions,
    setActionId,
    setActionEvent,
    instance,
    actionElementInstance,
    selectActionElement,
    unselectActionElement,
    isActionElementSelected,
    add,
    remove,
    createActionElement,
    addActionElement,
    removeActionElement,
  }
})

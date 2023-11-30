import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { newName } from '@/shared/utils'

type Blueprint = Static<typeof blueprintSchema>
type FormField = Static<typeof fieldSchema>

export const useBlueprintEditor = defineStore('blueprint-editor', () => {
  const states = ref({
    // blueprints being edited
    blueprints: [] as Blueprint[],
    // currently edited blueprint
    blueprintId: undefined,
  })

  /**
   * Clone of the user's blueprints
   */
  const blueprints = computed(() => states.value.blueprints)

  /**
   * Current blueprint being edited
   */
  const blueprintId = computed(() => states.value.blueprintId)

  /**
   * Local blueprints
   */
  const locals = (menuId: string): Blueprint[] => (
    states.value.blueprints.filter((b) => menuId && b.menuId === menuId)
  )

  /**
   * Global blueprints
   */
  const globals = (): Blueprint[] => (
    states.value.blueprints.filter((b) => b.menuId === undefined)
  )

  /**
   * Sets the cloned blueprints
   *
   * @param list
   */
  const setBlueprints = (list: Blueprint[]) => {
    states.value.blueprints = list
  }

  /**
   * Get the instance of an blueprint by its id
   *
   * @param id Id of the blueprint
   *
   * @returns {Blueprint|undefined} Blueprint instance from the id
   */
  const instance = (id: string): Blueprint | undefined => (
    states.value.blueprints.find((b) => b._id === id)
  )

  /**
   * Creates a new blueprint
   *
   * @param options Options to add to the blueprint
   *
   * @returns {Blueprint} New blueprint
   */
  const add = (options: AnyData): Blueprint => {
    const b: Blueprint = {
      _id: hexObjectId(),
      name: newName('blueprint', states.value.blueprints),
      menuId: undefined,
      properties: {},
      componentType: '',
      ...options,
    }
    states.value.blueprints = [...states.value.blueprints, b]
    return b
  }

  /**
   * Removes a blueprint
   *
   * @param id Id of the blueprint to remove
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string): boolean => {
    const idx = states.value.blueprints
      .findIndex((b) => b._id === id)
    if (idx !== -1) {
      states.value.blueprints = [
        ...states.value.blueprints.slice(0, idx),
        ...states.value.blueprints.slice(idx + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Check if a blueprint is fully applied to a field
   *
   * @param id ID of the blueprint
   * @param field Form's field instance
   *
   * @returns {boolean} True if fully applied
   */
  const isApplied = (id: string, field: FormField): boolean => {
    const blueprint = instance(id)
    if (blueprint) {
      const keys = Object.keys(blueprint.properties)
      if (keys.length === 0) {
        return false
      }
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        if (field[k] !== blueprint.properties[k]) {
          return false
        }
      }
      return true
    }
    return false
  }

  /**
   * Apply the blueprint to a field
   *
   * @param id ID of the blueprint
   * @param field Form's field instance
   *
   * @returns {boolean} True if applied
   */
  const apply = (id: string, field: FormField): boolean => {
    if (!isApplied(id, field)) {
      const blueprint = instance(id)
      if (blueprint) {
        Object.keys(blueprint.properties).forEach((k) => {
          // eslint-disable-next-line no-param-reassign
          field[k] = blueprint.properties[k]
        })
        return true
      }
    }
    return false
  }

  /**
   * Unapply the blueprint to a field
   *
   * @param id ID of the blueprint
   * @param field Form's field instance
   *
   * @returns {boolean} True if unapplied
   */
  const unapply = (id: string, field: FormField): boolean => {
    const blueprint = instance(id)
    if (blueprint) {
      Object.keys(blueprint.properties).forEach((k) => {
        // eslint-disable-next-line no-param-reassign
        delete field[k]
      })
      return true
    }
    return false
  }

  /**
   * Returns true if the current blueprint being edited is the same as ID
   *
   * @param id ID of the blueprint
   *
   * @returns {boolean} True if the same
   */
  const isEditing = (id: string): boolean => (
    states.value.blueprintId === id
  )

  /**
   * Sets the blueprint being edited
   *
   * @param id ID of the blueprint
   */
  const edit = (id: string) => {
    states.value.blueprintId = id
  }

  return {
    states,
    blueprints,
    blueprintId,
    locals,
    globals,
    setBlueprints,
    instance,
    add,
    remove,
    isApplied,
    apply,
    unapply,
    isEditing,
    edit,
  }
})

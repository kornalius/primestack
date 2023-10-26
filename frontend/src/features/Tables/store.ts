import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
// eslint-disable-next-line import/no-cycle
import { menuOrPopupPresent } from '@/features/Editor/store'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

export const useTableEditor = defineStore('table-editor', () => {
  const states = ref({
    // selected table id
    selected: undefined,
    // selected table field id
    selectedField: undefined,
    // tables being edited
    tables: [] as Table[],
  })

  /**
   * Selected table id
   */
  const selected = computed(() => states.value.selected)

  /**
   * Selected table field id
   */
  const selectedField = computed(() => states.value.selectedField)

  /**
   * Clone of the user's tables
   */
  const tables = computed(() => states.value.tables)

  /**
   * Sets the cloned tables
   *
   * @param list
   */
  const setTables = (list: Table[]) => {
    states.value.tables = list
  }

  /**
   * Returns the table instance from an id
   *
   * @param id Id of the table
   *
   * @returns {Table|undefined} Instance of the table
   */
  const instance = (id: string): Table | undefined => (
    states.value.tables?.find
      ? states.value.tables?.find((t) => t._id === id)
      : undefined
  )

  /**
   * Returns the table field instance from an id
   *
   * @param id Id of the table field
   *
   * @returns {TableField|undefined} Instance of the table field
   */
  const fieldInstance = (id: string): TableField | undefined => {
    for (let i = 0; i < states.value.tables.length; i++) {
      const t = states.value.tables[i]
      const field = t.fields
        .find((f) => f._id === id)
      if (field) {
        return field
      }
    }
    return undefined
  }

  /**
   * Selects a table
   *
   * @param id Id of the table
   */
  const select = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = id
      return true
    }
    return false
  }

  /**
   * Unselects currently selected table
   */
  const unselect = (): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = undefined
      return true
    }
    return false
  }

  /**
   * Checks to see if a table is being selected or not
   *
   * @param id Id of the table
   *
   * @returns {boolean} True if the table is selected
   */
  const isSelected = (id: string): boolean => (
    states.value.selected === id
  )

  /**
   * Selects a table field
   *
   * @param id Id of the table field
   */
  const selectField = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selectedField = id
      return true
    }
    return false
  }

  /**
   * Unselects currently selected table field
   */
  const unselectField = (): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selectedField = undefined
      return true
    }
    return false
  }

  /**
   * Checks to see if a table field is being selected or not
   *
   * @param id Id of the table field
   *
   * @returns {boolean} True if the table field is selected
   */
  const isFieldSelected = (id: string): boolean => (
    states.value.selectedField === id
  )

  /**
   * Adds a new table
   *
   * @param selectIt Should we select it?
   *
   * @returns {Table} New table instance
   */
  const add = (selectIt?: boolean): Table => {
    const t = {
      _id: hexObjectId(),
      name: undefined,
      methods: ['get', 'find', 'create', 'patch', 'remove'],
      created: true,
      updated: true,
      softDelete: false,
      user: true,
      fields: [],
      indexes: [],
    }
    states.value.tables = [...states.value.tables, t]
    if (selectIt) {
      select(t._id)
    }
    return t
  }

  /**
   * Removes a table
   *
   * @param id Id of the table to remove
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string): boolean => {
    const index = states.value.tables
      .findIndex((m) => m._id === id)
    if (index !== -1) {
      states.value.tables = [
        ...states.value.tables.slice(0, index),
        ...states.value.tables.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Adds a new table field
   *
   * @param tableId Table id to add the field to
   *
   * @returns {TableField} New table field instance
   */
  const addField = (tableId: string): TableField => {
    const table = instance(tableId)
    if (table) {
      const f = {
        _id: hexObjectId(),
        name: undefined,
        type: 'string',
        hidden: false,
        array: false,
        optional: false,
        readonly: false,
        queryable: true,
        refTableId: undefined,
        refFields: [],
      }
      table.fields = [...table.fields, f]
      return f
    }
    return undefined
  }

  /**
   * Removes a table field
   *
   * @param id Id of the table to remove
   * @param table Table instance to remove the field from
   *
   * @returns {boolean} True is successful
   */
  const removeField = (id: string, table: Table): boolean => {
    const t = instance(table._id)
    const index = t.fields
      .findIndex((f) => f._id === id)
    if (index !== -1) {
      t.fields = [
        ...t.fields.slice(0, index),
        ...t.fields.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
    states,
    selected,
    selectedField,
    tables,
    setTables,
    instance,
    fieldInstance,
    select,
    unselect,
    isSelected,
    selectField,
    unselectField,
    isFieldSelected,
    add,
    remove,
    addField,
    removeField,
  }
})

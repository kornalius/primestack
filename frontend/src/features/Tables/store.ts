import { ref, Ref } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import hexObjectId from 'hex-object-id'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { recreateTableIds } from '@/shared/table'
import { newName } from '@/shared/utils'
import { AnyData } from '@/shared/interfaces/commons'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

export const useTableEditor = defineStore('table-editor', () => {
  /**
   * Is the tables editor active?
   */
  const tablesEditor = ref(false)

  /**
   * Table id being edited
   */
  const tableId = ref() as Ref<string>

  /**
   * Clone of the user's tables
   */
  const tables = ref([]) as Ref<Table[]>

  /**
   * Sets the cloned tables
   *
   * @param list
   */
  const setTables = (list: Table[]) => {
    tables.value = list
  }

  /**
   * Sets the table id being edited
   *
   * @param id ID of the table
   */
  const setTableId = (id: string) => {
    tableId.value = id
  }

  /**
   * Sets the tables editor as active or not
   *
   * @param active
   */
  const setTablesEditor = (active: boolean) => {
    tablesEditor.value = active
  }

  /**
   * Returns the table instance from an id
   *
   * @param id Id of the table
   *
   * @returns {Table|undefined} Instance of the table
   */
  const instance = (id: string): Table | undefined => (
    tables.value?.find
      ? tables.value?.find((t) => t._id === id)
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
    for (let i = 0; i < tables.value.length; i++) {
      const t = tables.value[i]
      const field = t?.fields
        .find((f) => f._id === id)
      if (field) {
        return field
      }
    }
    return undefined
  }

  /**
   * Adds a new table
   *
   * @param options Options to add to the table
   *
   * @returns {Table} New table instance
   */
  const add = (options?: AnyData): Table => {
    const id = hexObjectId()
    const t: Table = {
      _id: id,
      _internalType: 'table',
      path: id,
      name: undefined,
      methods: ['get', 'find', 'create', 'patch', 'remove'],
      created: true,
      updated: true,
      softDelete: false,
      userRead: true,
      userWrite: true,
      fields: [],
      indexes: [],
      ...(options || {}),
    }
    tables.value = [...tables.value, t]
    return t
  }

  /**
   * Duplicates a table
   *
   * @param table Table instance to duplicate
   *
   * @returns {Table} New table instance
   */
  const duplicate = (table: Table): Table => {
    const t = {
      ...recreateTableIds(cloneDeep(table)),
      name: newName('table', tables.value),
    }
    tables.value = [...tables.value, t]
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
    const index = tables.value
      .findIndex((m) => m._id === id)
    if (index !== -1) {
      tables.value = [
        ...tables.value.slice(0, index),
        ...tables.value.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Adds a new table field
   *
   * @param table Table instance the field will belong to
   * @param options Options to add to the table field
   *
   * @returns {TableField} New table field instance
   */
  const addField = (table: Table, options?: AnyData): TableField => {
    const f: TableField = {
      _id: hexObjectId(),
      _internalType: 'table-field',
      name: newName('field', table.fields),
      type: 'string',
      queryable: true,
      optional: true,
      transforms: [],
      refFields: [],
      ...(options || {}),
    }
    // eslint-disable-next-line no-param-reassign
    table.fields = [...table.fields, f]
    return f
  }

  /**
   * Duplicates a table field
   *
   * @param field Table field instance to duplicate
   * @param table Table instance the field belongs to
   *
   * @returns {TableField} New table field instance
   */
  const duplicateField = (field: TableField, table: Table): TableField => {
    const f = {
      ...cloneDeep(field),
      _id: hexObjectId(),
    }
    // eslint-disable-next-line no-param-reassign
    table.fields = [...table.fields, f]
    return f
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
    const index = table.fields
      .findIndex((f) => f._id === id)
    if (index !== -1) {
      // eslint-disable-next-line no-param-reassign
      table.fields = [
        ...table.fields.slice(0, index),
        ...table.fields.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
    tablesEditor,
    tableId,
    tables,
    setTableId,
    setTablesEditor,
    setTables,
    instance,
    fieldInstance,
    add,
    duplicate,
    remove,
    addField,
    duplicateField,
    removeField,
  }
})

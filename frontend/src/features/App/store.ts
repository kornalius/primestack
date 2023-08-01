import { computed, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import hexObjectId from 'hex-object-id'
import { defineStore } from 'pinia'
import hotkeys from 'hotkeys-js'
import { useFeathers } from '@/composites/feathers'
import cloneDeep from 'lodash/cloneDeep'
import useSnacks from '@/features/Snacks/store'
import { AnyData } from '@/shared/interfaces/commons'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type Form = Static<typeof formSchema>
type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

interface Snapshot {
  menus: unknown[]
  forms: unknown[]
  tables: unknown[]
}

export default defineStore('app-editor', () => {
  const states = ref({
    active: false,
    selectedMenu: undefined,
    selectedTab: undefined,
    selectedTable: undefined,
    selectedTableField: undefined,
    selected: undefined,
    hovered: undefined,
    dragging: false,
    formId: undefined,
    menus: [],
    forms: [],
    tables: [],
    origSnapshot: {} as Snapshot,
    undoPtr: 0,
    undoStack: [] as Snapshot[],
  })

  const active = computed(() => states.value.active)
  const selected = computed(() => states.value.selected)
  const formId = computed(() => states.value.formId)
  const selectedMenu = computed(() => states.value.selectedMenu)
  const selectedTab = computed(() => states.value.selectedTab)
  const selectedTable = computed(() => states.value.selectedTable)
  const selectedTableField = computed(() => states.value.selectedTableField)
  const menus = computed(() => states.value.menus)
  const forms = computed(() => states.value.forms)
  const tables = computed(() => states.value.tables)

  const isModified = computed(() => {
    const f = isEqual(states.value.origSnapshot.forms, states.value.forms)
    const t = isEqual(states.value.origSnapshot.tables, states.value.tables)
    const m = isEqual(states.value.origSnapshot.menus, states.value.menus)
    return states.value.active && (!f || !t || !m)
  })

  const setFormId = (id: string): void => {
    states.value.formId = id
  }

  const select = (id: string): void => {
    states.value.selected = id
  }

  const unselect = (id: string): void => {
    if (states.value.selected === id) {
      states.value.selected = undefined
    }
  }

  const unselectAll = (): void => {
    states.value.selected = undefined
  }

  const isSelected = (id: string): boolean => (
    states.value.selected === id
  )

  const hovered = computed(() => states.value.hovered)

  const hover = (id: string): void => {
    states.value.hovered = id
  }

  const unhover = (): void => {
    states.value.hovered = undefined
  }

  const isHovered = (id: string): boolean => (
    states.value.hovered === id
  )

  const isDragging = computed(() => states.value.dragging)

  const setDragging = (d: boolean): void => {
    states.value.dragging = d
  }

  const unselectTab = (): void => {
    states.value.selectedTab = undefined
  }

  const selectMenu = (id: string): void => {
    states.value.selectedMenu = id
    select(undefined)
  }

  const isMenuSelected = (id: string): boolean => (
    states.value.selectedMenu === id
  )

  const selectTab = (id: string): void => {
    states.value.selectedTab = id
    select(undefined)
  }

  const isTabSelected = (id: string): boolean => (
    states.value.selectedTab === id
  )

  const unselectMenu = (): void => {
    states.value.selectedMenu = undefined
    unselectTab()
  }

  const selectTable = (id: string): void => {
    states.value.selectedTable = id
  }

  const unselectTable = (): void => {
    states.value.selectedTable = undefined
  }

  const isTableSelected = (id: string): boolean => (
    states.value.selectedTable === id
  )

  const selectTableField = (id: string): void => {
    states.value.selectedTableField = id
  }

  const unselectTableField = (): void => {
    states.value.selectedTableField = undefined
  }

  const isTableFieldSelected = (id: string): boolean => (
    states.value.selectedTableField === id
  )

  const maxUndoStack = 25

  const loadFromStore = () => {
    const { api } = useFeathers()

    return {
      userMenus: api.service('menus').findOneInStore({ query: {} }),
      userForms: api.service('forms').findOneInStore({ query: {} }),
      userTables: api.service('tables').findOneInStore({ query: {} }),
    }
  }

  const saveToStore = (snapshot: Snapshot): void => {
    const { userMenus, userForms, userTables } = loadFromStore()

    if (snapshot.menus && userMenus.value) {
      userMenus.value.list = snapshot.menus
    }
    if (snapshot.forms && userForms.value) {
      userForms.value.list = snapshot.forms
    }
    if (snapshot.tables && userTables.value) {
      userTables.value.list = snapshot.tables
    }

    states.value.menus = snapshot.menus
    states.value.forms = snapshot.forms
    states.value.tables = snapshot.tables
  }

  const snapshot = (): Snapshot => (
    {
      menus: cloneDeep(states.value.menus),
      forms: cloneDeep(states.value.forms),
      tables: cloneDeep(states.value.tables),
    }
  )

  const clearUndoStack = (): void => {
    states.value.undoStack = []
    states.value.undoPtr = 0
  }

  const startEdit = (): void => {
    states.value.active = true

    const { userMenus, userForms, userTables } = loadFromStore()

    states.value.menus = cloneDeep(userMenus.value?.list)
    states.value.forms = cloneDeep(userForms.value?.list)
    states.value.tables = cloneDeep(userTables.value?.list)

    states.value.origSnapshot = snapshot()

    hotkeys.setScope('edit')
  }

  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
    unselectTable()
    states.value.formId = undefined
    states.value.selected = undefined
    clearUndoStack()
    hotkeys.setScope('app')
  }

  const reset = (): void => {
    saveToStore(states.value.origSnapshot)
    states.value.origSnapshot = {} as Snapshot
  }

  const save = async (): Promise<void> => {
    const { api } = useFeathers()

    const { userMenus, userForms, userTables } = loadFromStore()

    states.value.menus = cloneDeep(
      (await api.service('menus').patch(userMenus.value._id, {
        ...userMenus.value,
        list: states.value.menus,
      }) as AnyData).list,
    )

    states.value.tables = cloneDeep(
      (await api.service('tables').patch(userTables.value._id, {
        ...userTables.value,
        list: states.value.tables,
      }) as AnyData).list,
    )

    states.value.forms = cloneDeep(
      (await api.service('forms').patch(userForms.value._id, {
        ...userForms.value,
        list: states.value.forms,
      }) as AnyData).list,
    )

    const snacks = useSnacks()
    snacks.pushSuccess('Saved successfully')
  }

  const snap = debounce(() => {
    if (states.value.undoStack.length > maxUndoStack) {
      states.value.undoStack.shift()
    }
    states.value.undoStack = states.value.undoStack.slice(0, states.value.undoPtr + 1)
    states.value.undoStack.push(snapshot())
    states.value.undoPtr = states.value.undoStack.length - 1
  }, 250)

  let stopWatchHandle

  const startWatch = (): void => {
    if (!stopWatchHandle) {
      stopWatchHandle = watch([
        () => states.value.menus,
        () => states.value.forms,
        () => states.value.tables,
      ], () => {
        snap()
      }, { deep: true })
    }
  }

  const cancelWatch = (): void => {
    if (stopWatchHandle) {
      stopWatchHandle()
    }
    stopWatchHandle = undefined
  }

  const canUndo = computed(() => (
    states.value.undoPtr > 0
  ))

  const undo = (): boolean => {
    if (canUndo.value) {
      cancelWatch()
      states.value.undoPtr -= 1
      saveToStore(cloneDeep(states.value.undoStack[states.value.undoPtr]))
      setTimeout(startWatch, 100)
      return true
    }
    return false
  }

  const canRedo = computed(() => (
    states.value.undoPtr < states.value.undoStack.length - 1
  ))

  const redo = (): boolean => {
    if (canRedo.value) {
      cancelWatch()
      states.value.undoPtr += 1
      saveToStore(cloneDeep(states.value.undoStack[states.value.undoPtr]))
      setTimeout(startWatch, 100)
      return true
    }
    return false
  }

  const preventSystemUndoRedo = (e: KeyboardEvent) => {
    if (states.value.active) {
      if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
        redo()
        e.preventDefault()
      } else if (e.ctrlKey && e.key === 'z') {
        undo()
        e.preventDefault()
      }
    }
  }

  const formInstance = (id: string): Form | undefined => (
    states.value.forms?.find
      ? states.value.forms?.find((f) => f._id === id)
      : undefined
  )

  const menuInstance = (id: string): Menu | undefined => (
    states.value.menus?.find
      ? states.value.menus?.find((m) => m._id === id)
      : undefined
  )

  const tableInstance = (id: string): Table | undefined => (
    states.value.tables?.find
      ? states.value.tables?.find((t) => t._id === id)
      : undefined
  )

  const findTabById = (id: string): Tab | undefined => {
    const findTab = (m: Menu): Tab | undefined => (
      m.tabs.find((t) => t._id === id)
    )
    return states.value.menus.find(findTab)
  }

  const addMenu = (): Menu => {
    const m = {
      _id: hexObjectId(),
      label: undefined,
      icon: undefined,
      color: undefined,
      href: undefined,
      target: '_self',
      tabs: [],
    }
    states.value.menus.push(m)
    return m
  }

  const removeMenu = (id: string): boolean => {
    const index = states.value.menus.findIndex((m) => m._id === id)
    menus.value.splice(index, 1)
    return true
  }

  const addTab = (): Tab => {
    const f = {
      _id: hexObjectId(),
      name: 'form',
      fields: [],
    }
    states.value.forms?.push(f)

    const t: Tab = {
      _id: hexObjectId(),
      label: 'New Tab',
      icon: undefined,
      color: undefined,
      formId: f._id,
    }

    const menu = menuInstance(states.value.selectedMenu)
    menu.tabs.push(t)
    return t
  }

  const removeTab = (id: string): boolean => {
    const t = findTabById(id)
    const idx = states.value.forms.findIndex((f) => f._id === t.formId)
    if (idx !== -1) {
      states.value.forms.splice(idx, 1)
    }

    const menu = menuInstance(states.value.selectedMenu)
    const index = menu.tabs.findIndex((tab) => tab._id === id)
    menu.tabs.splice(index, 1)
    return true
  }

  const createFormField = (component: TFormComponent): TFormField => ({
    _id: hexObjectId(),
    _type: component.type,
    _columns: component.row ? [] : undefined,
    _fields: component.col ? [] : undefined,
    ...Object.keys(component.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
      ), {}),
    ...(defaultValues(component.defaultValues) || {}),
  })

  const addFieldToForm = (component: TFormComponent): TFormField | undefined => {
    const form = states.value.forms.find((f) => f._id === states.value.formId)
    if (form) {
      const field = createFormField(component)
      // eslint-disable-next-line no-underscore-dangle
      form._fields.push(field)
      setTimeout(() => {
        select(field._id)
      }, 100)
      return field
    }
    return undefined
  }

  const addColumnToField = (
    components: TFormComponent[],
    componentType: string,
    field: TFormField,
  ): TFormColumn => {
    let type

    if (componentType === 'row') {
      type = 'col'
    } else if (componentType === 'card') {
      type = 'card-section'
    }

    const colComponent = components.find((c) => c.type === type)

    const col = {
      _id: hexObjectId(),
      _type: type,
      _columns: undefined,
      _fields: [],
      size: undefined,
      ...Object.keys(colComponent.schema?.properties || {})
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueForSchema(colComponent.schema.properties[k]) }
        ), {}),
      ...(defaultValues(colComponent.defaultValues) || {}),
    } as TFormColumn
    // eslint-disable-next-line no-underscore-dangle
    field._columns.push(col)
    return col
  }

  const removeColumnFromField = (column: TFormColumn, field: TFormField): void => {
    // eslint-disable-next-line no-underscore-dangle
    const idx = field._columns.findIndex((c) => c._id === column._id)
    if (idx !== -1) {
      // eslint-disable-next-line no-underscore-dangle
      field._columns.splice(idx, 1)
    }
  }

  const addTable = (): Table => {
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
    states.value.tables.push(t)
    return t
  }

  const removeTable = (id: string): boolean => {
    const index = states.value.tables.findIndex((m) => m._id === id)
    tables.value.splice(index, 1)
    return true
  }

  const addFieldToTable = (table: Table): TableField => {
    const f = {
      _id: hexObjectId(),
      name: undefined,
      type: 'string',
      hidden: false,
      array: false,
      optional: false,
      readonly: false,
      queryable: true,
    }
    table.fields.push(f)
    return f
  }

  const removeFieldFromTable = (id: string, table: Table): boolean => {
    const index = table.fields.findIndex((f) => f._id === id)
    table.fields.splice(index, 1)
    return true
  }

  startWatch()

  return {
    states,
    active,
    selectedMenu,
    selectedTab,
    selected,
    selectedTable,
    selectedTableField,
    formId,
    select,
    unselect,
    unselectAll,
    isSelected,
    hovered,
    hover,
    unhover,
    isHovered,
    isDragging,
    setDragging,
    selectMenu,
    unselectMenu,
    isMenuSelected,
    selectTab,
    unselectTab,
    isTabSelected,
    startEdit,
    endEdit,
    setFormId,
    selectTable,
    unselectTable,
    isTableSelected,
    selectTableField,
    unselectTableField,
    isTableFieldSelected,
    menus,
    forms,
    tables,
    save,
    reset,
    snap,
    canUndo,
    undo,
    canRedo,
    redo,
    preventSystemUndoRedo,
    formInstance,
    menuInstance,
    tableInstance,
    isModified,
    addMenu,
    removeMenu,
    addTab,
    removeTab,
    createFormField,
    addFieldToForm,
    addColumnToField,
    removeColumnFromField,
    addTable,
    removeTable,
    addFieldToTable,
    removeFieldFromTable,
  }
})

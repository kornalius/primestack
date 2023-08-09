import {
  computed, ref, watch, WatchStopHandle,
} from 'vue'
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
// eslint-disable-next-line import/no-cycle
import useFormElements from '@/features/Forms/composites'
import useActions from '@/features/Actions/composites'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { fieldSchema, formSchema } from '@/shared/schemas/form'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { actionSchema, actionElementSchema } from '@/shared/schemas/actions'
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import { TAction } from '@/shared/interfaces/actions'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>
type Action = Static<typeof actionSchema>
type ActionElement = Static<typeof actionElementSchema>

interface Snapshot {
  menus: Menu[]
  forms: Form[]
  tables: Table[]
  actions: Action[]
}

const { flattenActions } = useActions()
const { flattenFields } = useFormElements()

export default defineStore('app-editor', () => {
  const states = ref({
    active: false,
    selectedMenu: undefined,
    selectedTab: undefined,
    selectedTable: undefined,
    selectedTableField: undefined,
    selectedActionElement: undefined,
    selected: undefined,
    hovered: undefined,
    dragging: false,
    formId: undefined,
    actionId: undefined,
    menus: [] as Menu[],
    forms: [] as Form[],
    tables: [] as Table[],
    actions: [] as Action[],
    origSnapshot: {} as Snapshot,
    undoPtr: 0,
    undoStack: [] as Snapshot[],
  })

  const active = computed(() => states.value.active)
  const selected = computed(() => states.value.selected)
  const formId = computed(() => states.value.formId)
  const actionId = computed(() => states.value.actionId)
  const selectedMenu = computed(() => states.value.selectedMenu)
  const selectedTab = computed(() => states.value.selectedTab)
  const selectedTable = computed(() => states.value.selectedTable)
  const selectedTableField = computed(() => states.value.selectedTableField)
  const selectedActionElement = computed(() => states.value.selectedActionElement)
  const menus = computed(() => states.value.menus)
  const forms = computed(() => states.value.forms)
  const tables = computed(() => states.value.tables)
  const actions = computed(() => states.value.actions)

  const isModified = computed(() => {
    const f = isEqual(states.value.origSnapshot.forms, states.value.forms)
    const t = isEqual(states.value.origSnapshot.tables, states.value.tables)
    const m = isEqual(states.value.origSnapshot.menus, states.value.menus)
    const a = isEqual(states.value.origSnapshot.actions, states.value.actions)
    return states.value.active && (!f || !t || !m || !a)
  })

  const setFormId = (id: string): void => {
    states.value.formId = id
  }

  const select = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selected = id
    }
  }

  const unselect = (id: string): void => {
    if (states.value.selected === id) {
      states.value.selected = undefined
    }
  }

  const unselectAll = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selected = undefined
    }
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
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTab = undefined
    }
  }

  const selectMenu = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedMenu = id
      select(undefined)
    }
  }

  const isMenuSelected = (id: string): boolean => (
    states.value.selectedMenu === id
  )

  const selectTab = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTab = id
      select(undefined)
    }
  }

  const isTabSelected = (id: string): boolean => (
    states.value.selectedTab === id
  )

  const unselectMenu = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedMenu = undefined
      unselectTab()
    }
  }

  const selectTable = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTable = id
    }
  }

  const unselectTable = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTable = undefined
    }
  }

  const isTableSelected = (id: string): boolean => (
    states.value.selectedTable === id
  )

  const selectTableField = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTableField = id
    }
  }

  const unselectTableField = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTableField = undefined
    }
  }

  const isTableFieldSelected = (id: string): boolean => (
    states.value.selectedTableField === id
  )

  const actionInstance = (id: string): Action | undefined => (
    states.value.actions.find((a) => a._id === id)
  )

  const actionElementInstance = (id: string): ActionElement | undefined => {
    const currentAction = actionInstance(states.value.actionId)
    if (!currentAction) {
      return undefined
    }
    // eslint-disable-next-line no-underscore-dangle
    return flattenActions(currentAction._actions).find((a) => a._id === id)
  }

  const selectActionElement = (id: string): void => {
    states.value.selectedActionElement = id
  }

  const unselectActionElement = (): void => {
    states.value.selectedActionElement = undefined
  }

  const setActionId = (id: string): void => {
    states.value.actionId = id
    const a = actionInstance(id)
    if (a) {
      // eslint-disable-next-line no-underscore-dangle
      selectActionElement(a._actions?.[0]?._id)
    }
  }

  const isActionElementSelected = (id: string): boolean => (
    states.value.selectedActionElement === id
  )

  const maxUndoStack = 25

  const loadFromStore = () => {
    const { api } = useFeathers()

    return {
      userMenus: api.service('menus').findOneInStore({ query: {} }),
      userForms: api.service('forms').findOneInStore({ query: {} }),
      userTables: api.service('tables').findOneInStore({ query: {} }),
      userActions: api.service('actions').findOneInStore({ query: {} }),
    }
  }

  const saveToStore = (snapshot: Snapshot): void => {
    const {
      userMenus,
      userForms,
      userTables,
      userActions,
    } = loadFromStore()

    if (snapshot.menus && userMenus.value) {
      userMenus.value.list = snapshot.menus
    }
    if (snapshot.forms && userForms.value) {
      userForms.value.list = snapshot.forms
    }
    if (snapshot.tables && userTables.value) {
      userTables.value.list = snapshot.tables
    }
    if (snapshot.actions && userActions.value) {
      userActions.value.list = snapshot.actions
    }

    states.value.menus = snapshot.menus
    states.value.forms = snapshot.forms
    states.value.tables = snapshot.tables
    states.value.actions = snapshot.actions
  }

  const snapshot = (): Snapshot => (
    {
      menus: cloneDeep(states.value.menus),
      forms: cloneDeep(states.value.forms),
      tables: cloneDeep(states.value.tables),
      actions: cloneDeep(states.value.actions),
    }
  )

  const clearUndoStack = (): void => {
    states.value.undoStack = []
    states.value.undoPtr = 0
  }

  const startEdit = (): void => {
    states.value.active = true

    const {
      userMenus,
      userForms,
      userTables,
      userActions,
    } = loadFromStore()

    states.value.menus = cloneDeep(userMenus.value?.list)
    states.value.forms = cloneDeep(userForms.value?.list)
    states.value.tables = cloneDeep(userTables.value?.list)
    states.value.actions = cloneDeep(userActions.value?.list)

    states.value.origSnapshot = snapshot()

    hotkeys.setScope('edit')
  }

  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
    unselectTable()
    unselectActionElement()
    states.value.formId = undefined
    states.value.actionId = undefined
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

    const {
      userMenus,
      userForms,
      userTables,
      userActions,
    } = loadFromStore()

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

    states.value.actions = cloneDeep(
      (await api.service('actions').patch(userActions.value._id, {
        ...userForms.value,
        list: states.value.actions,
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

  let stopWatchHandle: WatchStopHandle

  const startWatch = (): void => {
    if (!stopWatchHandle) {
      stopWatchHandle = watch([
        () => states.value.menus,
        () => states.value.forms,
        () => states.value.tables,
        () => states.value.actions,
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

  const formFieldInstance = (id: string): FormField | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    flattenFields(formInstance(states.value.formId)?._fields || []).find((f) => f._id === id) as FormField
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

  const tableFieldInstance = (id: string, t: Table): TableField | undefined => (
    t?.fields?.find
      ? t.fields.find((f) => f._id === id)
      : undefined
  )

  const findTabById = (id: string): Tab | undefined => {
    for (let i = 0; i < states.value.menus.length; i++) {
      const m = states.value.menus[i]
      const tab = m.tabs.find((t) => t._id === id)
      if (tab) {
        return tab
      }
    }
    return undefined
  }

  const addMenu = (selectIt?: boolean): Menu => {
    const m: Menu = {
      _id: hexObjectId(),
      label: undefined,
      icon: undefined,
      color: undefined,
      href: undefined,
      target: '_self',
      tabs: [],
    }
    states.value.menus.push(m)
    if (selectIt) {
      selectMenu(m._id)
    }
    return m
  }

  const removeMenu = (id: string): boolean => {
    const index = states.value.menus.findIndex((m) => m._id === id)
    if (index !== -1) {
      menus.value.splice(index, 1)
      return true
    }
    return false
  }

  const addTab = (selectIt?: boolean): Tab => {
    const f: Form = {
      _id: hexObjectId(),
      _fields: [],
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
    if (selectIt) {
      selectTab(t._id)
    }
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
    if (index !== -1) {
      menu.tabs.splice(index, 1)
      return true
    }
    return false
  }

  const createFormField = (component: TFormComponent, options?: AnyData): TFormField => ({
    _id: hexObjectId(),
    _type: component.type,
    _columns: component.row ? [] : undefined,
    _fields: component.col ? [] : undefined,
    ...Object.keys(component.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
      ), {}),
    ...(defaultValues(component.defaultValues) || {}),
    ...(options || {}),
  })

  const addFieldToForm = (component: TFormComponent, options?: AnyData): TFormField | undefined => {
    const form = states.value.forms.find((f) => f._id === states.value.formId)
    if (form) {
      const field = createFormField(component, options)
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
    let type: string

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

  const removeColumnFromField = (column: TFormColumn, field: TFormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const index = field._columns.findIndex((c) => c._id === column._id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle
      field._columns.splice(index, 1)
      return true
    }
    return false
  }

  const addTable = (selectIt?: boolean): Table => {
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
    if (selectIt) {
      selectTable(t._id)
    }
    return t
  }

  const removeTable = (id: string): boolean => {
    const index = states.value.tables.findIndex((m) => m._id === id)
    if (index !== -1) {
      tables.value.splice(index, 1)
      return true
    }
    return false
  }

  const addFieldToTable = (tableId: string): TableField => {
    const table = tableInstance(tableId)
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
      }
      table.fields.push(f)
      return f
    }
    return undefined
  }

  const removeFieldFromTable = (id: string, table: Table): boolean => {
    const index = table.fields.findIndex((f) => f._id === id)
    if (index !== -1) {
      table.fields.splice(index, 1)
      return true
    }
    return false
  }

  const createAction = (id: string, props: AnyData, edit?: boolean): Action => {
    if (id) {
      const act = states.value.actions.find((a) => a._id === id)
      if (edit && act) {
        setActionId(act._id)
      }
      return act
    }

    const a: Action = {
      _id: hexObjectId(),
      _actions: [],
      ...props,
    }
    states.value.actions.push(a)
    if (edit) {
      setActionId(a._id)
    }
    return a
  }

  const removeAction = (id: string): boolean => {
    const idx = states.value.actions.findIndex((a) => a._id === id)
    if (idx !== -1) {
      states.value.actions.splice(idx, 1)
      return true
    }
    return false
  }

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

  const addActionElement = (action: TAction, selectIt?: boolean): ActionElement => {
    const currentAction = actionInstance(states.value.actionId)

    const a: ActionElement = {
      _id: hexObjectId(),
      _type: action.type,
      _children: [],
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

  const removeActionElement = (id: string): boolean => {
    const currentAction = actionInstance(states.value.actionId)
    // eslint-disable-next-line no-underscore-dangle
    const index = currentAction._actions.findIndex((a) => a._id === id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle
      currentAction._actions.splice(index, 1)
      return true
    }
    return false
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
    selectedActionElement,
    formId,
    actionId,
    menus,
    forms,
    tables,
    actions,
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
    save,
    reset,
    snap,
    canUndo,
    undo,
    canRedo,
    redo,
    preventSystemUndoRedo,
    formInstance,
    formFieldInstance,
    menuInstance,
    tableInstance,
    tableFieldInstance,
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
    setActionId,
    selectActionElement,
    unselectActionElement,
    isActionElementSelected,
    actionInstance,
    actionElementInstance,
    createAction,
    removeAction,
    createActionElement,
    addActionElement,
    removeActionElement,
  }
})

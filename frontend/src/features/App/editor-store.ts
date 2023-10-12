import {
  computed, ref, watch, WatchStopHandle,
} from 'vue'
import { Static } from '@feathersjs/typebox'
import debounce from 'lodash/debounce'
import isEqual from 'lodash/isEqual'
import hexObjectId from 'hex-object-id'
import { defineStore } from 'pinia'
import hotkeys from 'hotkeys-js'
import { useFeathersService } from '@/composites/feathers'
import cloneDeep from 'lodash/cloneDeep'
import { useSnacks } from '@/features/Snacks/store'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { flattenActions } from '@/features/Actions/composites'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import {
  columnSchema, fieldSchema, formSchema, formTableColumnSchema,
} from '@/shared/schemas/form'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { actionSchema, actionElementSchema } from '@/shared/schemas/actions'
import { TFormComponent } from '@/shared/interfaces/forms'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import { newNameForField, flattenFields } from '@/shared/form'
import { TAction } from '@/shared/interfaces/actions'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type FormTableColumn = Static<typeof formTableColumnSchema>
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

export const useAppEditor = defineStore('app-editor', () => {
  const states = ref({
    // are we in an editing session or not?
    active: false,
    // is the forms editor active or not?
    formsEditor: false,
    // selected menu id
    selectedMenu: undefined,
    // selected tab id
    selectedTab: undefined,
    // selected table id
    selectedTable: undefined,
    // selected table field id
    selectedTableField: undefined,
    // selected action element id
    selectedActionElement: undefined,
    // selected form element id
    selected: undefined,
    // selected form table component column
    selectedFormTableColumn: undefined,
    // id of element being hovered on with the mouse
    hovered: undefined,
    // is something being dragged?
    dragging: false,
    // id of the form being edited
    formId: undefined,
    // id of action being edited
    actionId: undefined,
    // name of action event being edited
    actionEvent: undefined,
    // menus being edited
    menus: [] as Menu[],
    // forms being edited
    forms: [] as Form[],
    // tables being edited
    tables: [] as Table[],
    // actions being edited
    actions: [] as Action[],
    // Original snapshot at start of editing
    origSnapshot: {} as Snapshot,
    // Undo pointer
    undoPtr: 0,
    // Undo stack
    undoStack: [] as Snapshot[],
  })

  /**
   * Is the editor active?
   */
  const active = computed(() => states.value.active)

  /**
   * Is the forms editor active?
   */
  const formsEditor = computed(() => states.value.formsEditor)

  /**
   * Currently selected form element id
   */
  const selected = computed(() => states.value.selected)

  /**
   * Id of the form being edited
   */
  const formId = computed(() => states.value.formId)

  /**
   * Selected action id
   */
  const actionId = computed(() => states.value.actionId)

  /**
   * Selected action event name
   */
  const actionEvent = computed(() => states.value.actionEvent)

  /**
   * Selected menu id
   */
  const selectedMenu = computed(() => states.value.selectedMenu)

  /**
   * Selected tab id
   */
  const selectedTab = computed(() => states.value.selectedTab)

  /**
   * Selected table id
   */
  const selectedTable = computed(() => states.value.selectedTable)

  /**
   * Selected table field id
   */
  const selectedTableField = computed(() => states.value.selectedTableField)

  /**
   * Selected form table component column id
   */
  const selectedFormTableColumn = computed(() => states.value.selectedFormTableColumn)

  /**
   * Selected action element id
   */
  const selectedActionElement = computed(() => states.value.selectedActionElement)

  /**
   * Clone of the user's menus
   */
  const menus = computed(() => states.value.menus)

  /**
   * Clone of the user's forms
   */
  const forms = computed(() => states.value.forms)

  /**
   * Clone of the user's tables
   */
  const tables = computed(() => states.value.tables)

  /**
   * Clone of the user's actions
   */
  const actions = computed(() => states.value.actions)

  /**
   * Was there any modifications to the elements being edited?
   */
  const isModified = computed((): boolean => {
    const f = isEqual(states.value.origSnapshot.forms, states.value.forms)
    const t = isEqual(states.value.origSnapshot.tables, states.value.tables)
    const m = isEqual(states.value.origSnapshot.menus, states.value.menus)
    const a = isEqual(states.value.origSnapshot.actions, states.value.actions)
    return states.value.active && (!f || !t || !m || !a)
  })

  /**
   * Returns the form instance from an id
   *
   * @param id Id of the form
   *
   * @returns {Form|undefined} Instance of the form
   */
  const formInstance = (id: string): Form | undefined => (
    states.value.forms?.find
      ? states.value.forms?.find((f) => f._id === id)
      : undefined
  )

  /**
   * Returns a flattened list of instance of form's fields
   */
  const flatFields = (): FormField[] => (
    // eslint-disable-next-line no-underscore-dangle
    flattenFields(formInstance(states.value.formId)?._fields || [])
  )

  /**
   * Returns the form field instance from an id
   *
   * @param id Id of the form field
   *
   * @returns {FormField|undefined} Instance of the form field
   */
  const formFieldInstance = (id: string): FormField | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    flatFields().find((f) => f._id === id) as FormField
  )

  /**
   * Return the form's table element instance for the column
   *
   * @param id Id of the form's table column
   *
   * @returns {FormField} Form's table instance
   */
  const formInstanceForTableColumn = (id: string): FormField => {
    // eslint-disable-next-line no-underscore-dangle
    const fc = flatFields()
    for (let i = 0; i < fc.length; i++) {
      // eslint-disable-next-line no-underscore-dangle
      if (fc[i]._type === 'table') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const col = (fc[i] as any)?.columns.find((c: FormTableColumn) => c._id === id)
        if (col) {
          return fc[i]
        }
      }
    }
    return undefined
  }

  /**
   * Set the forms editor mode
   *
   * @param a Active or not
   */
  const setFormsEditor = (a: boolean): void => {
    states.value.formsEditor = a
  }

  /**
   * Set the form id currently being edited
   *
   * @param id Id of the form
   */
  const setFormId = (id: string): void => {
    states.value.formId = id
  }

  /**
   * Selects a form element
   *
   * @param id Id of the element
   */
  const select = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selected = id
      states.value.selectedFormTableColumn = undefined
    }
  }

  /**
   * Unselects the form element
   *
   * @param id Id of the element
   */
  const unselect = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      if (states.value.selected === id) {
        states.value.selected = undefined
        states.value.selectedFormTableColumn = undefined
      }
    }
  }

  /**
   * Unselects all form elements
   */
  const unselectAll = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selected = undefined
      states.value.selectedFormTableColumn = undefined
    }
  }

  /**
   * Check if a form element is currently selected
   *
   * @param id Id of the element
   *
   * @returns {boolean} True if selected
   */
  const isSelected = (id: string): boolean => (
    states.value.selected === id
  )

  /**
   * Selects a form's table component column
   *
   * @param id Id of the table column
   */
  const selectFormTableColumn = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      const fc = formInstanceForTableColumn(id)
      if (fc) {
        select(fc._id)
      }
      states.value.selectedFormTableColumn = id
    }
  }

  /**
   * Unselects currently selected form's table component column
   */
  const unselectFormTableColumn = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedFormTableColumn = undefined
    }
  }

  /**
   * Checks to see if a form's table column is being selected or not
   *
   * @param id Id of the form's table colum
   *
   * @returns {boolean} True if the form's table column is selected
   */
  const isFormTableColumnSelected = (id: string): boolean => (
    states.value.selectedFormTableColumn === id
  )

  /**
   * Returns the currently selected table component column instance from an id
   *
   * @param id Id of the table component column
   *
   * @returns {TableField|undefined} Instance of the table column
   */
  const formTableColumnInstance = (id: string): TableField | undefined => (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (formInstanceForTableColumn(id) as any)?.columns
      .find((c: FormTableColumn) => c._id === id)
  )

  /**
   * Id of an element being hovered on with the mouse
   */
  const hovered = computed((): string => states.value.hovered)

  /**
   * Sets the element id being hovered on with the mouse
   *
   * @param id Id of the element
   */
  const hover = (id: string): void => {
    states.value.hovered = id
  }

  /**
   * Resets what element id is being hovered on with the mouse
   */
  const unhover = (): void => {
    states.value.hovered = undefined
  }

  /**
   * Is the element being hovered on with the mouse matches this id?
   *
   * @param id Id of the element
   *
   * @returns {boolean} True if same as id
   */
  const isHovered = (id: string): boolean => (
    states.value.hovered === id
  )

  /**
   * Is something being dragged?
   */
  const isDragging = computed(() => states.value.dragging)

  /**
   * Sets whether something is being dragged or not
   *
   * @param d Is something currently being dragged
   */
  const setDragging = (d: boolean): void => {
    states.value.dragging = d
  }

  /**
   * Unselects currently selected tab
   */
  const unselectTab = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTab = undefined
    }
  }

  /**
   * Selects a menu
   *
   * @param id Id of the menu
   */
  const selectMenu = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      select(undefined)
      states.value.selectedMenu = id
    }
  }

  /**
   * Checks to see if a menu is being selected or not
   *
   * @param id Id of the menu
   *
   * @returns {boolean} True if the menu is selected
   */
  const isMenuSelected = (id: string): boolean => (
    states.value.selectedMenu === id
  )

  /**
   * Selects a tab
   *
   * @param id Id of the tab
   */
  const selectTab = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      select(undefined)
      states.value.selectedTab = id
    }
  }

  /**
   * Checks to see if a tab is being selected or not
   *
   * @param id Id of the tab
   *
   * @returns {boolean} True if the tab is selected
   */
  const isTabSelected = (id: string): boolean => (
    states.value.selectedTab === id
  )

  /**
   * Unselects currently selected menu
   */
  const unselectMenu = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedMenu = undefined
      unselectTab()
    }
  }

  /**
   * Selects a table
   *
   * @param id Id of the table
   */
  const selectTable = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTable = id
    }
  }

  /**
   * Unselects currently selected table
   */
  const unselectTable = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTable = undefined
    }
  }

  /**
   * Checks to see if a table is being selected or not
   *
   * @param id Id of the table
   *
   * @returns {boolean} True if the table is selected
   */
  const isTableSelected = (id: string): boolean => (
    states.value.selectedTable === id
  )

  /**
   * Selects a table field
   *
   * @param id Id of the table field
   */
  const selectTableField = (id: string): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTableField = id
    }
  }

  /**
   * Unselects currently selected table field
   */
  const unselectTableField = (): void => {
    if (!document.querySelector('.q-popup-edit')) {
      states.value.selectedTableField = undefined
    }
  }

  /**
   * Checks to see if a table field is being selected or not
   *
   * @param id Id of the table field
   *
   * @returns {boolean} True if the table field is selected
   */
  const isTableFieldSelected = (id: string): boolean => (
    states.value.selectedTableField === id
  )

  /**
   * Get the instance of an action by its id
   *
   * @param id Id of the action
   *
   * @returns {Action|undefined} Action instance from the id
   */
  const actionInstance = (id: string): Action | undefined => (
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
    const currentAction = actionInstance(states.value.actionId)
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
  const selectActionElement = (id: string): void => {
    states.value.selectedActionElement = id
  }

  /**
   * Unselects currently selected action element
   */
  const unselectActionElement = (): void => {
    states.value.selectedActionElement = undefined
  }

  /**
   * Sets the current action id being edited
   * @param id
   */
  const setActionId = (id: string): void => {
    states.value.actionId = id
    const a = actionInstance(id)
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
   * Maximum size of the undo stack
   */
  const maxUndoStack = 25

  /**
   * Reload all instances from the store
   */
  const loadFromStore = () => ({
    userMenus: useFeathersService('menus').findOneInStore({ query: {} }),
    userForms: useFeathersService('forms').findOneInStore({ query: {} }),
    userTables: useFeathersService('tables').findOneInStore({ query: {} }),
    userActions: useFeathersService('actions').findOneInStore({ query: {} }),
  })

  /**
   * Save a snapshot to the store and sets the current editing elements to this snapshot
   *
   * @param snapshot Snapshot to save
   */
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

  /**
   * Creates a snapshot of the current editing elements
   */
  const snapshot = (): Snapshot => (
    {
      menus: cloneDeep(states.value.menus),
      forms: cloneDeep(states.value.forms),
      tables: cloneDeep(states.value.tables),
      actions: cloneDeep(states.value.actions),
    }
  )

  /**
   * Clears the undo stack
   */
  const clearUndoStack = (): void => {
    states.value.undoStack = []
    states.value.undoPtr = 0
  }

  /**
   * Starts an editing session. Also saves an original snapshot.
   */
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

  /**
   * Ends an editing session
   */
  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
    unselectTable()
    unselectActionElement()
    setFormsEditor(false)
    states.value.formId = undefined
    states.value.actionId = undefined
    states.value.selected = undefined
    clearUndoStack()
    hotkeys.setScope('app')
  }

  /**
   * Resets an editing session to its original snapshot when
   * editing was last started started
   */
  const reset = (): void => {
    saveToStore(states.value.origSnapshot)
    states.value.origSnapshot = {} as Snapshot
  }

  /**
   * Computes if the form can be saved properly
   *
   * @returns {boolean} Returns true if the form can be saved
   */
  const canSave = computed((): boolean => {
    if (!isModified.value) {
      return false
    }

    const nameExists = (field: FormField): boolean => {
      if (!field.name) {
        return false
      }
      // eslint-disable-next-line no-underscore-dangle
      return !!flatFields()
        .find((f: FormField) => f.name
          && f._id !== field._id
          && f.name.toLowerCase() === field.name.toLowerCase())
    }

    // eslint-disable-next-line no-underscore-dangle
    return !flatFields().find((f) => nameExists(f))
  })

  /**
   * Save the editing session into the store
   */
  const save = async (): Promise<void> => {
    const {
      userMenus,
      userForms,
      userTables,
      userActions,
    } = loadFromStore()

    states.value.menus = cloneDeep(
      (await useFeathersService('menus').patch(userMenus.value._id, {
        ...userMenus.value,
        list: states.value.menus,
      }) as AnyData).list,
    )

    states.value.tables = cloneDeep(
      (await useFeathersService('tables').patch(userTables.value._id, {
        ...userTables.value,
        list: states.value.tables,
      }) as AnyData).list,
    )

    states.value.forms = cloneDeep(
      (await useFeathersService('forms').patch(userForms.value._id, {
        ...userForms.value,
        list: states.value.forms,
      }) as AnyData).list,
    )

    states.value.actions = cloneDeep(
      (await useFeathersService('actions').patch(userActions.value._id, {
        ...userActions.value,
        list: states.value.actions,
      }) as AnyData).list,
    )

    const snacks = useSnacks()
    snacks.pushSuccess('Saved successfully')
  }

  /**
   * Debounced snap function
   */
  const snap = debounce(() => {
    if (states.value.undoStack.length > maxUndoStack) {
      states.value.undoStack.shift()
    }
    states.value.undoStack = states.value.undoStack.slice(0, states.value.undoPtr + 1)
    states.value.undoStack.push(snapshot())
    states.value.undoPtr = states.value.undoStack.length - 1
  }, 250)

  let stopWatchHandle: WatchStopHandle

  /**
   * Starts watching for changes in the editing session.
   * If changed, creates a snapshot in the undo stack.
   */
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

  /**
   * Stop watching for changes in the editing session.
   */
  const cancelWatch = (): void => {
    if (stopWatchHandle) {
      stopWatchHandle()
    }
    stopWatchHandle = undefined
  }

  /**
   * Can we undo changes?
   */
  const canUndo = computed(() => (
    states.value.undoPtr > 0
  ))

  /**
   * Undo current changes to the last snapshot
   */
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

  /**
   * Can we redo changes?
   */
  const canRedo = computed(() => (
    states.value.undoPtr < states.value.undoStack.length - 1
  ))

  /**
   * Redo changes
   */
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

  /**
   * Prevent system undo or redo keys (ctrl+z, ctrl+shift+z) while in editing session.
   *
   * @param e
   */
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

  /**
   * Returns the menu instance from an id
   *
   * @param id Id of the menu
   *
   * @returns {Menu|undefined} Instance of the menu
   */
  const menuInstance = (id: string): Menu | undefined => (
    states.value.menus?.find
      ? states.value.menus
        ?.find((m) => m._id === id)
      : undefined
  )

  /**
   * Returns the table instance from an id
   *
   * @param id Id of the table
   *
   * @returns {Table|undefined} Instance of the table
   */
  const tableInstance = (id: string): Table | undefined => (
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
  const tableFieldInstance = (id: string): TableField | undefined => {
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
   * Returns the tab instance from an id
   *
   * @param id Id of the tab
   *
   * @returns {Tab|undefined} Instance of the tab
   */
  const tabInstance = (id: string): Tab | undefined => {
    for (let i = 0; i < states.value.menus.length; i++) {
      const m = states.value.menus[i]
      const tab = m.tabs
        .find((t) => t._id === id)
      if (tab) {
        return tab
      }
    }
    return undefined
  }

  /**
   * Adds a new form
   *
   * @param selectIt Should we select it?
   *
   * @returns {Form} New form instance
   */
  const addForm = (selectIt?: boolean): Form => {
    const f: Form = {
      _id: hexObjectId(),
      name: newNameForField('form', states.value.forms),
      _fields: [],
    }
    states.value.forms = [...states.value.forms, f]
    if (selectIt) {
      states.value.formId = f._id
    }
    return f
  }

  /**
   * Removes a form
   *
   * @param id Id of the form to remove
   *
   * @returns {boolean} True is successful
   */
  const removeForm = (id: string): boolean => {
    const index = states.value.forms
      .findIndex((f) => f._id === id)
    if (index !== -1) {
      states.value.forms = [
        ...states.value.forms.slice(0, index),
        ...states.value.forms.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Adds a new menu
   *
   * @param selectIt Should we select it?
   *
   * @returns {Menu} New menu instance
   */
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
    states.value.menus = [...states.value.menus, m]
    if (selectIt) {
      selectMenu(m._id)
    }
    return m
  }

  /**
   * Removes a menu
   *
   * @param id Id of the menu to remove
   *
   * @returns {boolean} True is successful
   */
  const removeMenu = (id: string): boolean => {
    const index = states.value.menus
      .findIndex((m) => m._id === id)
    if (index !== -1) {
      states.value.menus = [
        ...states.value.menus.slice(0, index),
        ...states.value.menus.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Adds a new tab
   *
   * @param selectIt Should we select it?
   *
   * @returns {Tab} New tab instance
   */
  const addTab = (selectIt?: boolean): Tab => {
    const f = addForm()

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

  /**
   * Removes a tab
   *
   * @param id Id of the tab to remove
   *
   * @returns {boolean} True is successful
   */
  const removeTab = (id: string): boolean => {
    const t = tabInstance(id)
    const idx = states.value.forms
      .findIndex((f) => f._id === t.formId)
    if (idx !== -1) {
      states.value.forms = [
        ...states.value.forms.slice(0, idx),
        ...states.value.forms.slice(idx + 1),
      ]
    }

    const menu = menuInstance(states.value.selectedMenu)
    const index = menu.tabs
      .findIndex((tab) => tab._id === id)
    if (index !== -1) {
      menu.tabs = [
        ...menu.tabs.slice(0, index),
        ...menu.tabs.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Creates a new form field
   *
   * @param component Component type to derive new field from
   * @param options Options to add the field
   *
   * @returns {FormField | FormColumn} New form field
   */
  const createFormField = (
    component: TFormComponent,
    options?: AnyData,
  ): FormField | FormColumn | undefined => {
    const form = formInstance(states.value.formId)
    if (form) {
      return {
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
        // eslint-disable-next-line no-underscore-dangle
        name: newNameForField(component.type, flatFields()),
      }
    }
    return undefined
  }

  /**
   * Adds a new field to the edited form
   *
   * @param component Component instance
   * @param options Options to add to the field
   *
   * @returns {FormField | FormColumn} New field instance
   */
  const addFieldToForm = (
    component: TFormComponent,
    options?: AnyData,
  ): FormField | FormColumn | undefined => {
    const form = states.value.forms
      .find((f) => f._id === states.value.formId)
    if (form) {
      const field = createFormField(component, options)
      if (field) {
        // eslint-disable-next-line no-underscore-dangle
        form._fields.push(field as FormField)
        setTimeout(() => {
          select(field._id)
        }, 100)
        return field
      }
    }
    return undefined
  }

  /**
   * Adds a new column to a field
   *
   * @param componentsByType Component instances classed by type
   * @param componentType Type of component of the field
   * @param field Field instance to add the column to
   *
   * @returns {FormColumn} New tab instance
   */
  const addColumnToField = (
    componentsByType: Record<string, TFormComponent>,
    componentType: string,
    field: FormField,
  ): FormColumn => {
    let type: string

    if (componentType === 'row') {
      type = 'col'
    } else if (componentType === 'card') {
      type = 'card-section'
    }

    const colComponent = componentsByType[type]

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
      // eslint-disable-next-line no-underscore-dangle
      name: newNameForField(type, flatFields()),
    } as FormColumn
    // eslint-disable-next-line no-underscore-dangle
    field._columns.push(col)
    return col
  }

  /**
   * Removes a column from a field
   *
   * @param column Column to remove
   * @param field Field to remove the column from
   *
   * @returns {boolean} True is successful
   */
  const removeColumnFromField = (column: FormColumn, field: FormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const index = field._columns
      .findIndex((c) => c._id === column._id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      field._columns = [
        // eslint-disable-next-line no-underscore-dangle
        ...field._columns.slice(0, index),
        // eslint-disable-next-line no-underscore-dangle
        ...field._columns.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Adds a new table
   *
   * @param selectIt Should we select it?
   *
   * @returns {Table} New table instance
   */
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
    states.value.tables = [...states.value.tables, t]
    if (selectIt) {
      selectTable(t._id)
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
  const removeTable = (id: string): boolean => {
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
  const removeFieldFromTable = (id: string, table: Table): boolean => {
    const t = tableInstance(table._id)
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

  /**
   * Creates a new action
   *
   * @param options Options to add to the action
   * @param selectIt Should we select it?
   *
   * @returns {Action} New action
   */
  const createAction = (options: AnyData, selectIt?: boolean): Action => {
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
  const removeAction = (id: string): boolean => {
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
    const currentAction = actionInstance(states.value.actionId)

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
    const currentAction = actionInstance(states.value.actionId)
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

  startWatch()

  return {
    states,
    active,
    formsEditor,
    selectedMenu,
    selectedTab,
    selected,
    selectedTable,
    selectedTableField,
    selectedFormTableColumn,
    selectedActionElement,
    formId,
    actionId,
    actionEvent,
    menus,
    forms,
    tables,
    actions,
    select,
    unselect,
    unselectAll,
    isSelected,
    selectFormTableColumn,
    unselectFormTableColumn,
    isFormTableColumnSelected,
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
    setFormsEditor,
    startEdit,
    endEdit,
    setFormId,
    selectTable,
    unselectTable,
    isTableSelected,
    selectTableField,
    unselectTableField,
    isTableFieldSelected,
    canSave,
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
    formTableColumnInstance,
    menuInstance,
    tableInstance,
    tableFieldInstance,
    isModified,
    addForm,
    removeForm,
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
    setActionEvent,
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

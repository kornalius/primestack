import {
  computed, ref, WatchStopHandle, watch,
} from 'vue'
import { Static } from '@feathersjs/typebox'
import isEqual from 'lodash/isEqual'
import { defineStore } from 'pinia'
import hotkeys from 'hotkeys-js'
import { useFeathersService } from '@/composites/feathers'
import cloneDeep from 'lodash/cloneDeep'
import { AnyData } from '@/shared/interfaces/commons'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import {
  columnSchema, fieldSchema, formSchema, formTableColumnSchema,
} from '@/shared/schemas/form'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { actionElementSchema, actionSchema } from '@/shared/schemas/actions'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { TFormComponent } from '@/shared/interfaces/forms'
import { useSnacks } from '@/features/Snacks/store'
import { useUndo } from '@/features/Undo/store'
// eslint-disable-next-line import/no-cycle
import { useMenuEditor } from '@/features/Menus/store'
// eslint-disable-next-line import/no-cycle
import { useTabEditor } from '@/features/Tabs/store'
// eslint-disable-next-line import/no-cycle
import { useFormEditor } from '@/features/Forms/store'
// eslint-disable-next-line import/no-cycle
import { useActionEditor } from '@/features/Actions/store'
// eslint-disable-next-line import/no-cycle
import { useTableEditor } from '@/features/Tables/store'
import { usePropertiesEditor } from '@/features/Properties/store'
import { useBlueprintEditor } from '@/features/Blueprints/store'
import hexObjectId from 'hex-object-id'
import { componentsByType } from '@/features/Components'
import { TAction } from '@/shared/interfaces/actions'
import { actionsByType } from '@/features/Actions/composites'
import {
  flattenFields,
  parentFormField,
  parentFormFieldArray,
  recreateFormIds,
} from '@/shared/form'
import { recreateMenuIds } from '@/shared/menu'
import { recreateTableIds } from '@/shared/table'

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
type Blueprint = Static<typeof blueprintSchema>

interface Snapshot {
  menus: Menu[]
  forms: Form[]
  tables: Table[]
  actions: Action[]
  blueprints: Blueprint[]
}

let previousScope: string

/**
 * Returns true if a popup editor or a menu is visible on the screen
 *
 * @return {boolean}
 */
export const menuOrPopupPresent = (): boolean => (
  !!document.querySelector('.q-popup-edit, .q-menu')
)

export const useAppEditor = defineStore('app-editor', () => {
  const states = ref({
    // are we in an editing session or not?
    active: false,
    // selected entity id
    selected: undefined,
    // id of element being hovered on with the mouse
    hovered: undefined,
    // is something being dragged?
    dragging: false,
    // Original snapshot at start of editing
    origSnapshot: {} as Snapshot,
  })

  const undoStore = useUndo('editor-undo')()

  const menuEditor = useMenuEditor()

  const tabEditor = useTabEditor()

  const formEditor = useFormEditor()

  const actionEditor = useActionEditor()

  const tableEditor = useTableEditor()

  const propertiesEditor = usePropertiesEditor()

  const blueprintEditor = useBlueprintEditor()

  /**
   * Is the editor active?
   */
  const active = computed(() => states.value.active)

  /**
   * Currently selected form element id
   */
  const selected = computed(() => states.value.selected)

  /**
   * Was there any modifications to the elements being edited?
   */
  const isModified = computed((): boolean => {
    const f = isEqual(states.value.origSnapshot.forms, formEditor.forms)
    const t = isEqual(states.value.origSnapshot.tables, tableEditor.tables)
    const m = isEqual(states.value.origSnapshot.menus, menuEditor.menus)
    const a = isEqual(states.value.origSnapshot.actions, actionEditor.actions)
    const b = isEqual(states.value.origSnapshot.blueprints, blueprintEditor.blueprints)
    return states.value.active && (!f || !t || !m || !a || !b)
  })

  /**
   * Returns a type string from an entity id
   *
   * @param id
   *
   * @returns {string|undefined}
   */
  const storeTypeForId = (id: string): string | undefined => {
    if (formEditor.instance(id)) {
      return 'form'
    }
    if (formEditor.fieldInstance(id)) {
      return 'field'
    }
    if (formEditor.tableColumnInstance(id)) {
      return 'table-column'
    }
    if (menuEditor.instance(id)) {
      return 'menu'
    }
    if (menuEditor.tabInstance(id)) {
      return 'tab'
    }
    if (tableEditor.instance(id)) {
      return 'table'
    }
    if (tableEditor.fieldInstance(id)) {
      return 'table-field'
    }
    if (actionEditor.instance(id)) {
      return 'action'
    }
    if (actionEditor.actionElementInstance(id)) {
      return 'action-element'
    }
    return undefined
  }

  /**
   * Returns an instance from an id
   *
   * @param id
   *
   * @returns {AnyData|undefined}
   */
  const instance = (id: string): AnyData | undefined => {
    const type = storeTypeForId(id)
    switch (type) {
      case 'form': return formEditor.instance(id)
      case 'field': return formEditor.fieldInstance(id)
      case 'table-column': return formEditor.tableColumnInstance(id)
      case 'menu': return menuEditor.instance(id)
      case 'tab': return menuEditor.tabInstance(id)
      case 'table': return tableEditor.instance(id)
      case 'table-field': return tableEditor.fieldInstance(id)
      case 'action': return actionEditor.instance(id)
      case 'action-element': return actionEditor.actionElementInstance(id)
      default: return undefined
    }
  }

  /**
   * Return a flatten list of all the fields in the currently edited form
   *
   * @returns {FormField[]}
   */
  const flattenFormFields = (): FormField[] => (
    // eslint-disable-next-line no-underscore-dangle
    flattenFields(formEditor.instance(formEditor.formId)._fields)
  )

  /**
   * Selects an entity by its id
   *
   * @param id Id of the entity
   */
  const select = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      setTimeout(() => {
        states.value.selected = id
      }, 100)
      return true
    }
    return false
  }

  /**
   * Unselects the entity
   *
   * @param id Id of the entity
   */
  const unselect = (id: string): boolean => {
    if (!menuOrPopupPresent() && states.value.selected === id) {
      states.value.selected = undefined
      return true
    }
    return false
  }

  /**
   * Unselects all form elements
   */
  const unselectAll = (): void => {
    if (!menuOrPopupPresent()) {
      states.value.selected = undefined
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
   * Adds a new menu
   *
   * @param options Optional values
   * @param selectIt Select the menu
   *
   * @returns {Menu} New menu instance
   */
  const addMenu = (options?: AnyData, selectIt?: boolean): Menu => {
    const menu = menuEditor.add(options)
    if (menu && selectIt) {
      select(menu._id)
    }
    return menu
  }

  /**
   * Adds a new tab
   *
   * @param menu Menu instance to add the tab to
   * @param form Form instance associated with the tab
   * @param options Options to add to the tab
   * @param selectIt Should we select it?
   *
   * @returns {Tab} New tab instance
   */
  const addTab = (menu: Menu, form: Form, options?: AnyData, selectIt?: boolean): Tab => {
    const activeMenu = menuEditor.instance(menuEditor.menuId)
    const tab = tabEditor.add(options, menu || activeMenu, form || formEditor.add())
    if (tab && selectIt) {
      select(tab._id)
    }
    return tab
  }

  /**
   * Removes a tab
   *
   * @param id Id of the tab to remove
   * @param menu Menu instance to remove tab from
   *
   * @returns {boolean} True is successful
   */
  const removeTab = (id: string, menu: Menu): boolean => {
    const t = menuEditor.tabInstance(id)
    formEditor.remove(t.formId)
    const activeMenu = menuEditor.instance(menuEditor.menuId)
    return tabEditor.remove(id, menu || activeMenu)
  }

  /**
   * Adds a new table
   *
   * @param options Options to add to the table
   * @param selectIt Should we select it?
   *
   * @returns {Table} New table instance
   */
  const addTable = (options?: AnyData, selectIt?: boolean): Table => {
    const table = tableEditor.add(options)
    if (table && selectIt) {
      select(table._id)
    }
    return table
  }

  /**
   * Adds a new table field to a table
   *
   * @param table Table instance to add the table field to
   * @param options Options to add to the table field
   * @param selectIt Should we select it?
   *
   * @returns {TableField} New table field instance
   */
  const addFieldToTable = (table: Table, options?: AnyData, selectIt?: boolean): TableField => {
    const tableField = tableEditor.addField(table, options)
    if (tableField && selectIt) {
      select(tableField._id)
    }
    return tableField
  }

  /**
   * Reload all instances from the store
   */
  const loadFromStore = () => ({
    userMenus: useFeathersService('menus').findOneInStore({ query: {} }),
    userForms: useFeathersService('forms').findOneInStore({ query: {} }),
    userTables: useFeathersService('tables').findOneInStore({ query: {} }),
    userActions: useFeathersService('actions').findOneInStore({ query: {} }),
    userBlueprints: useFeathersService('blueprints').findOneInStore({ query: {} }),
  })

  /**
   * Save a snapshot to the stores and sets the current editing elements to this snapshot
   *
   * @param snapshot Snapshot to save
   */
  const saveToStore = (snapshot: Snapshot): void => {
    const {
      userMenus,
      userForms,
      userTables,
      userActions,
      userBlueprints,
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
    if (snapshot.blueprints && userBlueprints.value) {
      userBlueprints.value.list = snapshot.blueprints
    }

    menuEditor.setMenus(snapshot.menus)
    formEditor.setForms(snapshot.forms)
    tableEditor.setTables(snapshot.tables)
    actionEditor.setActions(snapshot.actions)
    blueprintEditor.setBlueprints(snapshot.blueprints)
  }

  /**
   * Creates a snapshot of the current editing elements
   */
  const snapshot = (): Snapshot => ({
    menus: cloneDeep(menuEditor.menus),
    forms: cloneDeep(formEditor.forms),
    tables: cloneDeep(tableEditor.tables),
    actions: cloneDeep(actionEditor.actions),
    blueprints: cloneDeep(blueprintEditor.blueprints),
  })

  /**
   * Starts watching for changes in the editing session.
   * If changed, creates a snapshot in the undo stack.
   */
  const startWatch = (): WatchStopHandle => watch([
    () => menuEditor.menus,
    () => formEditor.forms,
    () => tableEditor.tables,
    () => actionEditor.actions,
    () => blueprintEditor.blueprints,
  ], undoStore.snap(snapshot), { deep: true })

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
      userBlueprints,
    } = loadFromStore()

    menuEditor.setMenus(cloneDeep(userMenus.value?.list))
    formEditor.setForms(cloneDeep(userForms.value?.list))
    tableEditor.setTables(cloneDeep(userTables.value?.list))
    actionEditor.setActions(cloneDeep(userActions.value?.list))
    blueprintEditor.setBlueprints(cloneDeep(userBlueprints.value?.list))

    undoStore.startWatch(startWatch)
    undoStore.snap(snapshot)()

    states.value.origSnapshot = snapshot()

    previousScope = hotkeys.getScope()

    hotkeys.setScope('edit')
  }

  /**
   * Ends an editing session
   */
  const endEdit = (): void => {
    undoStore.cancelWatch()
    states.value.active = false
    menuEditor.setMenuId(undefined)
    tableEditor.setTableId(undefined)
    tableEditor.setTablesEditor(false)
    formEditor.setFormsEditor(false)
    formEditor.setFormId(undefined)
    menuEditor.setMenuId(undefined)
    tabEditor.setTabId(undefined)
    actionEditor.setActionId(undefined)
    states.value.selected = undefined
    undoStore.clearUndoStack()
    hotkeys.setScope(previousScope)
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
  const canSave = computed((): boolean => (
    isModified.value
  ))

  /**
   * Save the editing session into the store
   */
  const save = async (): Promise<void> => {
    const {
      userMenus,
      userForms,
      userTables,
      userActions,
      userBlueprints,
    } = loadFromStore()

    menuEditor.setMenus(cloneDeep(
      (await useFeathersService('menus').patch(userMenus.value._id, {
        ...userMenus.value,
        list: menuEditor.menus,
      }) as AnyData).list,
    ))

    tableEditor.setTables(cloneDeep(
      (await useFeathersService('tables').patch(userTables.value._id, {
        ...userTables.value,
        list: tableEditor.tables,
      }) as AnyData).list,
    ))

    formEditor.setForms(cloneDeep(
      (await useFeathersService('forms').patch(userForms.value._id, {
        ...userForms.value,
        list: formEditor.forms,
      }) as AnyData).list,
    ))

    actionEditor.setActions(cloneDeep(
      (await useFeathersService('actions').patch(userActions.value._id, {
        ...userActions.value,
        list: actionEditor.actions,
      }) as AnyData).list,
    ))

    blueprintEditor.setBlueprints(cloneDeep(
      (await useFeathersService('blueprints').patch(userBlueprints.value._id, {
        ...userBlueprints.value,
        list: blueprintEditor.blueprints,
      }) as AnyData).list,
    ))

    const snacks = useSnacks()
    snacks.pushSuccess('Saved successfully')
  }

  /**
   * Undo current changes to the last snapshot
   */
  const undo = (): boolean => {
    if (undoStore.undo()) {
      saveToStore(cloneDeep(undoStore.undoStack[undoStore.undoPtr]) as Snapshot)
      setTimeout(() => undoStore.startWatch(startWatch), 100)
      return true
    }
    return false
  }

  /**
   * Redo changes
   */
  const redo = (): boolean => {
    if (undoStore.redo()) {
      saveToStore(cloneDeep(undoStore.undoStack[undoStore.undoPtr] as Snapshot))
      setTimeout(() => undoStore.startWatch(startWatch), 100)
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
      undoStore.preventSystemUndoRedo(e)
    }
  }

  /**
   * Adds a new field to the edited form
   *
   * @param component Component instance
   * @param options Options to add to the field
   * @param selectIt Select it
   *
   * @returns {FormField | FormColumn} New field instance
   */
  const addFieldToForm = (
    component: TFormComponent,
    options?: AnyData,
    selectIt?: boolean,
  ): FormField | FormColumn | undefined => {
    const field = formEditor.addField(component, options)
    if (field && selectIt) {
      select(field._id)
    }
    return field
  }

  /**
   * Adds a new form
   *
   * @param options Options to add to the form
   * @param selectIt Should we select it?
   *
   * @returns {Form} New form instance
   */
  const addForm = (options?: AnyData, selectIt?: boolean): Form => {
    const form = formEditor.add(options)
    if (form && selectIt) {
      select(form._id)
    }
    return form
  }

  /**
   * Duplicates a form
   *
   * @param form Form instance to duplicate
   *
   * @returns {Form} New form instance
   */
  const duplicateForm = (form: Form): Form | undefined => {
    const newForm = formEditor.duplicate(form)
    if (newForm) {
      select(newForm._id)
      return newForm
    }
    return undefined
  }

  /**
   * Duplicates a field
   *
   * @param field Field instance to duplicate
   *
   * @returns {FormField|FormColumn|undefined} New field instance
   */
  const duplicateField = (field: FormField | FormColumn): FormField | FormColumn | undefined => {
    const newField = formEditor.duplicateField(field)
    if (newField) {
      select(newField._id)
      return newField
    }
    return undefined
  }

  /**
   * Duplicates a table column
   *
   * @param field Table column instance to duplicate
   *
   * @returns {FormTableColumn|undefined} New table column instance
   */
  const duplicateTableColumn = (field: FormTableColumn): FormTableColumn | undefined => {
    const newField = formEditor.duplicateTableColumn(field)
    if (newField) {
      select(newField._id)
      return newField
    }
    return undefined
  }

  /**
   * Duplicates a tab
   *
   * @param tab Tab instance to duplicate
   *
   * @returns {Tab|undefined} New tab instance
   */
  const duplicateTab = (tab: Tab): Tab | undefined => {
    const newTab = tabEditor.duplicate(
      tab,
      menuEditor.instance(menuEditor.menuId),
    )

    // duplicate forms for each tabs
    const f = formEditor.duplicate(formEditor.instance(newTab.formId))
    // eslint-disable-next-line no-param-reassign
    newTab.formId = f._id

    if (newTab) {
      select(newTab._id)
      return newTab
    }
    return undefined
  }

  /**
   * Duplicates a menu
   *
   * @param menu Menu instance to duplicate
   *
   * @returns {Menu|undefined} New menu instance
   */
  const duplicateMenu = (menu: Menu): Menu | undefined => {
    const newMenu = menuEditor.duplicate(menu)

    // duplicate forms for each tabs
    newMenu.tabs.forEach((t: Tab) => {
      const f = formEditor.duplicate(formEditor.instance(t.formId))
      // eslint-disable-next-line no-param-reassign
      t.formId = f._id
    })

    if (newMenu) {
      select(newMenu._id)
      return newMenu
    }
    return undefined
  }

  /**
   * Duplicates a table
   *
   * @param table Table instance to duplicate
   *
   * @returns {Table|undefined} New table instance
   */
  const duplicateTable = (table: Table): Table | undefined => {
    const newTable = tableEditor.duplicate(table)
    if (newTable) {
      select(newTable._id)
      return newTable
    }
    return undefined
  }

  /**
   * Duplicates a table field
   *
   * @param field Table field instance to duplicate
   *
   * @returns {TableField} New table field instance
   */
  const duplicateTableField = (field: TableField): TableField => {
    const newField = tableEditor.duplicateField(
      field,
      tableEditor.instance(tableEditor.tableId),
    )
    if (newField) {
      select(newField._id)
      return newField
    }
    return undefined
  }

  /**
   * Duplicates an action
   *
   * @param action Action instance to duplicate
   *
   * @returns {Action|undefined} New field instance
   */
  const duplicateAction = (action: Action): Action | undefined => {
    const newAction = actionEditor.duplicate(action)
    if (newAction) {
      select(newAction._id)
      return newAction
    }
    return undefined
  }

  /**
   * Duplicates an action element
   *
   * @param actionElement Action element instance to duplicate
   *
   * @returns {ActionElement|undefined} New field instance
   */
  const duplicateActionElement = (actionElement: ActionElement): ActionElement | undefined => {
    const newActionElement = actionEditor.duplicateActionElement(
      actionElement,
      actionEditor.instance(actionEditor.actionId),
    )
    if (newActionElement) {
      select(newActionElement._id)
      return newActionElement
    }
    return undefined
  }

  /**
   * Duplicate an instance
   */
  const duplicate = () => {
    const o = instance(states.value.selected)
    const type = storeTypeForId(o._id)

    switch (type) {
      case 'form': {
        duplicateForm(o as Form)
        select(o._id)
        break
      }

      case 'field': {
        duplicateField(o as FormField)
        select(o._id)
        break
      }

      case 'table-column': {
        duplicateTableColumn(o as FormTableColumn)
        select(o._id)
        break
      }

      case 'menu':
        duplicateMenu(o as Menu)
        select(o._id)
        break

      case 'tab':
        duplicateTab(o as Tab)
        select(o._id)
        break

      case 'action':
        duplicateAction(o as Action)
        select(o._id)
        break

      case 'action-element':
        duplicateActionElement(o as ActionElement)
        select(o._id)
        break

      case 'table':
        duplicateTable(o as Table)
        select(o._id)
        break

      case 'table-field':
        duplicateTableField(o as TableField)
        select(o._id)
        break

      default:
        break
    }
  }

  /**
   * Sets the current action id being edited
   * @param id
   */
  const setActionId = (id: string): void => {
    actionEditor.setActionId(id)
    const a = actionEditor.instance(id)
    if (a) {
      // eslint-disable-next-line no-underscore-dangle
      select(a._actions?.[0]?._id)
    }
  }

  /**
   * Adds a new action
   *
   * @param options Options to add to the action
   * @param selectIt Should we select it?
   *
   * @returns {Action} New action instance
   */
  const addAction = (options?: AnyData, selectIt?: boolean): Action => {
    const action = actionEditor.add(options)
    if (action && selectIt) {
      select(action._id)
    }
    return action
  }

  /**
   * Adds a new action element
   *
   * @param action Action type for the element
   * @param options Options to add to the action element
   * @param selectIt Should we select it?
   *
   * @returns {ActionElement} New action element instance
   */
  const addActionElement = (action: TAction, options?: AnyData, selectIt?: boolean): ActionElement => {
    const actionElement = actionEditor.addActionElement(action, options)
    if (actionElement && selectIt) {
      select(actionElement._id)
    }
    return actionElement
  }

  /**
   * Copy an object instance to the clipboard as text
   *
   * @param element Element instance
   */
  const copy = async (element?: AnyData) => {
    const o = element || instance(states.value.selected)
    return navigator.clipboard.writeText(JSON.stringify({
      type: storeTypeForId(o._id),
      data: o,
    }, undefined, 2))
  }

  /**
   * Paste from the clipboard into the selected instance
   */
  const paste = async () => {
    const reid = (o: AnyData): AnyData => {
      if (o !== undefined && o !== null) {
        if (Array.isArray(o)) {
          o.forEach((v) => reid(v))
        } else if (typeof o === 'object') {
          if (typeof o._id === 'string') {
            // eslint-disable-next-line no-param-reassign
            o._id = hexObjectId()
          }
          Object.keys(o).forEach((k) => reid(o[k]))
        }
      }
      return o
    }

    const t = await navigator.clipboard.readText()
    try {
      const { type, data: o } = JSON.parse(t)

      const selectedElement = instance(
        states.value.selected
          || formEditor.formId
          || tableEditor.tableId,
      )

      const selectedType = storeTypeForId(selectedElement?._id)

      switch (selectedType) {
        case 'form': {
          if (type === 'form') {
            const form = recreateFormIds(o)
            addForm(form)
            select(form._id)
          } else if (type === 'field') {
            const field = reid(o)
            // eslint-disable-next-line no-underscore-dangle
            formEditor.addField(componentsByType[field._type], field)
            select(field._id)
          }
          break
        }

        case 'field': {
          if (type === 'field') {
            const field = reid(o)
            // eslint-disable-next-line no-underscore-dangle
            const sc = componentsByType[selectedElement._type]
            // eslint-disable-next-line no-underscore-dangle
            const oc = componentsByType[field._type]
            if (sc.row && oc.col) {
              // eslint-disable-next-line no-underscore-dangle
              const columns = (selectedElement as FormField)._columns
              if (columns) {
                columns.push(field as FormColumn)
              }
            } else if (sc.col) {
              // eslint-disable-next-line no-underscore-dangle
              const fields = (selectedElement as FormColumn)._fields
              if (fields) {
                fields.push(field as FormField)
              }
            } else if (!oc.col) {
              const form = formEditor.instance(formEditor.formId)
              const arr = parentFormFieldArray(form, selectedElement as FormField)
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              arr.push(field as any)
            }
            select(field._id)
          }
          break
        }

        case 'menu':
          if (type === 'menu') {
            addMenu(recreateMenuIds(o), true)
          }
          break

        case 'tab':
          if (type === 'tab') {
            addTab(undefined, undefined, reid(o), true)
          }
          break

        case 'action':
        case 'action-element':
          if (type === 'action-element') {
            const actionElement = reid(o)
            // eslint-disable-next-line no-underscore-dangle
            addActionElement(actionsByType[actionElement._type], actionElement, true)
          }
          break

        case 'table':
          if (type === 'table') {
            // eslint-disable-next-line no-underscore-dangle
            addTable(recreateTableIds(o), true)
          } else if (type === 'table-field') {
            // eslint-disable-next-line no-underscore-dangle
            addFieldToTable(tableEditor.instance(states.value.selected), reid(o), true)
          }
          break

        case 'table-field':
          if (type === 'table-field') {
            // eslint-disable-next-line no-underscore-dangle
            addFieldToTable(tableEditor.instance(tableEditor.tableId), reid(o), true)
          }
          break

        default:
          break
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const removeSelected = () => {
    const o = instance(states.value.selected)
    const type = storeTypeForId(o?._id)

    switch (type) {
      case 'form': {
        formEditor.remove(o._id)
        break
      }

      case 'field': {
        const p = parentFormField(formEditor.instance(formEditor.formId), o as FormField)
        if (p) {
          // eslint-disable-next-line no-underscore-dangle
          const columns = (p as FormField)._columns
          if (columns) {
            const parent = p as FormField
            const idx = columns.indexOf(o as FormColumn)
            // eslint-disable-next-line no-underscore-dangle
            parent._columns = [
              ...columns.slice(0, idx),
              ...columns.slice(idx + 1),
            ]
          }
          // eslint-disable-next-line no-underscore-dangle
          const fields = (p as FormColumn)._fields
          if (fields) {
            const parent = p as FormColumn
            const idx = fields.indexOf(o as FormField)
            // eslint-disable-next-line no-underscore-dangle
            parent._fields = [
              ...fields.slice(0, idx),
              ...fields.slice(idx + 1),
            ]
          }
        }
        break
      }

      case 'table-column': {
        formEditor.removeTableColumn(o._id)
        break
      }

      case 'menu':
        menuEditor.remove(o._id)
        break

      case 'tab':
        tabEditor.remove(o._id, menuEditor.instance(menuEditor.menuId))
        break

      case 'action':
        actionEditor.remove(o._id)
        break

      case 'action-element':
        actionEditor.removeActionElement(o._id, actionEditor.instance(actionEditor.actionId))
        break

      case 'table':
        tableEditor.remove(o._id)
        break

      case 'table-field':
        tableEditor.removeField(o._id, tableEditor.instance(tableEditor.tableId))
        break

      default:
        break
    }
  }

  return {
    states,
    active,
    reset,
    isModified,
    startEdit,
    endEdit,

    /**
     * Duplicates
     */

    duplicate,
    duplicateMenu,
    duplicateTab,
    duplicateTable,
    duplicateTableField,
    duplicateAction,
    duplicateActionElement,
    duplicateForm,
    duplicateField,

    /**
     * Stores & instances
     */

    storeTypeForId,
    instance,

    /**
     * Hovered
     */

    hovered,
    hover,
    unhover,
    isHovered,

    /**
     * Dragging
     */

    isDragging,
    setDragging,

    /**
     * Save
     */

    canSave,
    save,

    /**
     * Clipboard
     */

    copy,
    paste,

    /**
     * Selection
     */

    selected,
    select,
    unselect,
    unselectAll,
    isSelected,
    removeSelected,

    /**
     * UndoStore
     */

    snap: undoStore.snap,
    canUndo: undoStore.canUndo,
    undo,
    canRedo: undoStore.canRedo,
    redo,
    preventSystemUndoRedo,

    /**
     * MenuEditor
     */

    menus: computed(() => menuEditor.menus),
    menuId: computed(() => menuEditor.menuId),
    setMenuId: menuEditor.setMenuId,
    menuInstance: menuEditor.instance,
    tabInstance: menuEditor.tabInstance,
    addMenu,
    removeMenu: menuEditor.remove,

    /**
     * TabEditor
     */

    tabId: computed(() => tabEditor.tabId),
    setTabId: tabEditor.setTabId,
    addTab,
    removeTab,

    /**
     * TableEditor
     */

    tables: computed(() => tableEditor.tables),
    tableId: computed(() => tableEditor.tableId),
    tablesEditor: computed(() => tableEditor.tablesEditor),
    tableInstance: tableEditor.instance,
    tableFieldInstance: tableEditor.fieldInstance,
    setTableId: tableEditor.setTableId,
    setTablesEditor: tableEditor.setTablesEditor,
    addTable,
    removeTable: tableEditor.remove,
    addFieldToTable,
    removeFieldFromTable: tableEditor.removeField,

    /**
     * ActionEditor
     */

    actions: computed(() => actionEditor.actions),
    actionId: computed(() => actionEditor.actionId),
    actionEvent: computed(() => actionEditor.actionEvent),
    setActionId,
    setActionEvent: actionEditor.setActionEvent,
    actionInstance: actionEditor.instance,
    actionElementInstance: actionEditor.actionElementInstance,
    addAction,
    removeAction: actionEditor.remove,
    createActionElement: actionEditor.createActionElement,
    addActionElement,
    removeActionElement: actionEditor.removeActionElement,

    /**
     * FormEditor
     */

    flattenFormFields,
    forms: computed(() => formEditor.forms),
    formsEditor: computed(() => formEditor.formsEditor),
    formId: computed(() => formEditor.formId),
    formInstance: formEditor.instance,
    formFieldInstance: formEditor.fieldInstance,
    formTableColumnInstance: formEditor.tableColumnInstance,
    setFormsEditor: formEditor.setFormsEditor,
    setFormId: formEditor.setFormId,
    addForm,
    removeForm: formEditor.remove,
    createFormField: formEditor.createField,
    addFieldToForm,
    addColumnToField: formEditor.addColumnToField,
    removeColumnFromField: formEditor.removeColumnFromField,
    preview: computed(() => formEditor.preview),
    previewFormData: computed(() => formEditor.previewFormData),
    showPreviewFormData: computed(() => formEditor.showPreviewFormData),
    setPreview: formEditor.setPreview,
    setPreviewFormData: formEditor.setPreviewFormData,
    setShowPreviewFormData: formEditor.setShowPreviewFormData,

    /**
     * PropertiesEditor
     */

    sections: computed(() => propertiesEditor.sections),
    scrollTops: computed(() => propertiesEditor.scrollTops),
    expanded: computed(() => propertiesEditor.expanded),
    setSection: propertiesEditor.setSection,
    section: propertiesEditor.section,
    setScrollTop: propertiesEditor.setScrollTop,
    scrollTop: propertiesEditor.scrollTop,
    setExpanded: propertiesEditor.setExpanded,
    isExpanded: propertiesEditor.isExpanded,
    expandedForId: propertiesEditor.expandedForId,

    /**
     * BlueprintEditor
     */

    blueprints: computed(() => blueprintEditor.blueprints),
    blueprintId: computed(() => blueprintEditor.blueprintId),
    localBlueprints: blueprintEditor.locals,
    globalBlueprints: blueprintEditor.globals,
    blueprintInstance: blueprintEditor.instance,
    addBlueprint: blueprintEditor.add,
    removeBlueprint: blueprintEditor.remove,
    isBlueprintApplied: blueprintEditor.isApplied,
    applyBlueprint: blueprintEditor.apply,
    unapplyBlueprint: blueprintEditor.unapply,
    isBlueprintEditing: blueprintEditor.isEditing,
    editBlueprint: blueprintEditor.edit,
  }
})

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
import { columnSchema, fieldSchema, formSchema } from '@/shared/schemas/form'
import { tableSchema } from '@/shared/schemas/table'
import { actionSchema } from '@/shared/schemas/actions'
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

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>
type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type Table = Static<typeof tableSchema>
type Action = Static<typeof actionSchema>

interface Snapshot {
  menus: Menu[]
  forms: Form[]
  tables: Table[]
  actions: Action[]
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
    // selected form element id
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
    return states.value.active && (!f || !t || !m || !a)
  })

  /**
   * Selects a form element
   *
   * @param id Id of the element
   */
  const select = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = id
      formEditor.unselectTableColumn()
      return true
    }
    return false
  }

  /**
   * Unselects the form element
   *
   * @param id Id of the element
   */
  const unselect = (id: string): boolean => {
    if (!menuOrPopupPresent() && states.value.selected === id) {
      states.value.selected = undefined
      formEditor.unselectTableColumn()
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
      formEditor.unselectTableColumn()
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
  const selectFormTableColumn = (id: string): boolean => (
    !!formEditor.selectTableColumn(id)
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
   * Selects a menu
   *
   * @param id Id of the menu
   */
  const selectMenu = (id: string): boolean => {
    if (menuEditor.select(id)) {
      select(undefined)
      return true
    }
    return false
  }

  /**
   * Selects a tab
   *
   * @param id Id of the tab
   */
  const selectTab = (id: string): boolean => {
    if (tabEditor.select(id)) {
      select(undefined)
      return true
    }
    return false
  }

  /**
   * Unselects currently selected menu
   */
  const unselectMenu = (): boolean => {
    if (menuEditor.unselect()) {
      return tabEditor.unselect()
    }
    return false
  }

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

    menuEditor.setMenus(snapshot.menus)
    formEditor.setForms(snapshot.forms)
    tableEditor.setTables(snapshot.tables)
    actionEditor.setActions(snapshot.actions)
  }

  /**
   * Creates a snapshot of the current editing elements
   */
  const snapshot = (): Snapshot => ({
    menus: cloneDeep(menuEditor.menus),
    forms: cloneDeep(formEditor.forms),
    tables: cloneDeep(tableEditor.tables),
    actions: cloneDeep(actionEditor.actions),
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
    } = loadFromStore()

    menuEditor.setMenus(cloneDeep(userMenus.value?.list))
    formEditor.setForms(cloneDeep(userForms.value?.list))
    tableEditor.setTables(cloneDeep(userTables.value?.list))
    actionEditor.setActions(cloneDeep(userActions.value?.list))

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
    menuEditor.unselect()
    tableEditor.unselect()
    formEditor.setFormsEditor(false)
    formEditor.setFormId(undefined)
    actionEditor.unselectActionElement()
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
   * Adds a new tab
   *
   * @param selectIt Should we select it?
   *
   * @returns {Tab} New tab instance
   */
  const addTab = (selectIt?: boolean): Tab => {
    const menu = menuEditor.instance(menuEditor.selected)
    return tabEditor.add(selectIt || false, menu, formEditor.add())
  }

  /**
   * Removes a tab
   *
   * @param id Id of the tab to remove
   *
   * @returns {boolean} True is successful
   */
  const removeTab = (id: string): boolean => {
    const t = menuEditor.tabInstance(id)
    formEditor.remove(t.formId)
    const menu = menuEditor.instance(menuEditor.selected)
    return tabEditor.remove(id, menu)
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
    const field = formEditor.addField(component, options)
    if (field) {
      setTimeout(() => {
        select(field._id)
      }, 100)
      return field
    }
    return undefined
  }

  return {
    states,
    active,
    formsEditor: computed(() => formEditor.formsEditor),
    selectedMenu: computed(() => menuEditor.selected),
    selectedTab: computed(() => tabEditor.selected),
    selected,
    selectedTable: computed(() => tableEditor.selected),
    selectedTableField: computed(() => tableEditor.selectedField),
    selectedFormTableColumn: computed(() => formEditor.selectedTableColumn),
    selectedActionElement: computed(() => actionEditor.selectedActionElement),
    formId: computed(() => formEditor.formId),
    actionId: computed(() => actionEditor.actionId),
    actionEvent: computed(() => actionEditor.actionEvent),
    menus: computed(() => menuEditor.menus),
    forms: computed(() => formEditor.forms),
    tables: computed(() => tableEditor.tables),
    actions: computed(() => actionEditor.actions),
    select,
    unselect,
    unselectAll,
    isSelected,
    selectFormTableColumn,
    unselectFormTableColumn: formEditor.unselectTableColumn,
    isFormTableColumnSelected: formEditor.isTableColumnSelected,
    hovered,
    hover,
    unhover,
    isHovered,
    isDragging,
    setDragging,
    selectMenu,
    unselectMenu,
    isMenuSelected: menuEditor.isSelected,
    selectTab,
    unselectTab: tabEditor.unselect,
    isTabSelected: tabEditor.selected,
    setFormsEditor: formEditor.setFormsEditor,
    startEdit,
    endEdit,
    setFormId: formEditor.setFormId,
    selectTable: tableEditor.select,
    unselectTable: tableEditor.unselect,
    isTableSelected: tableEditor.isSelected,
    selectTableField: tableEditor.selectField,
    unselectTableField: tableEditor.unselectField,
    isTableFieldSelected: tableEditor.isFieldSelected,
    canSave,
    save,
    reset,
    snap: undoStore.snap,
    canUndo: undoStore.canUndo,
    undo,
    canRedo: undoStore.canRedo,
    redo,
    preventSystemUndoRedo,
    formInstance: formEditor.instance,
    formFieldInstance: formEditor.fieldInstance,
    formTableColumnInstance: formEditor.tableColumnInstance,
    menuInstance: menuEditor.instance,
    tabInstance: menuEditor.tabInstance,
    tableInstance: tableEditor.instance,
    tableFieldInstance: tableEditor.fieldInstance,
    isModified,
    addForm: formEditor.add,
    removeForm: formEditor.remove,
    addMenu: menuEditor.add,
    removeMenu: menuEditor.remove,
    addTab,
    removeTab,
    createFormField: formEditor.createField,
    addFieldToForm,
    addColumnToField: formEditor.addColumnToField,
    removeColumnFromField: formEditor.removeColumnFromField,
    addTable: tableEditor.add,
    removeTable: tableEditor.remove,
    addFieldToTable: tableEditor.addField,
    removeFieldFromTable: tableEditor.removeField,
    setActionId: actionEditor.setActionId,
    setActionEvent: actionEditor.setActionEvent,
    selectActionElement: actionEditor.selectActionElement,
    unselectActionElement: actionEditor.unselectActionElement,
    isActionElementSelected: actionEditor.isActionElementSelected,
    actionInstance: actionEditor.instance,
    actionElementInstance: actionEditor.actionElementInstance,
    createAction: actionEditor.add,
    removeAction: actionEditor.remove,
    createActionElement: actionEditor.createActionElement,
    addActionElement: actionEditor.addActionElement,
    removeActionElement: actionEditor.removeActionElement,
    preview: computed(() => formEditor.preview),
    previewFormData: computed(() => formEditor.previewFormData),
    showPreviewFormData: computed(() => formEditor.showPreviewFormData),
    setPreview: formEditor.setPreview,
    setPreviewFormData: formEditor.setPreviewFormData,
    setShowPreviewFormData: formEditor.setShowPreviewFormData,
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
  }
})

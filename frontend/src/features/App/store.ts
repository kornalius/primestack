import { computed, ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { defineStore } from 'pinia'
import hotkeys from 'hotkeys-js'
import { useFeathers } from '@/composites/feathers'
import cloneDeep from 'lodash/cloneDeep'
import useSnacks from '@/features/Snacks/store'

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
    unselectTab()
  }

  const isMenuSelected = (id: string): boolean => (
    states.value.selectedMenu === id
  )

  const selectTab = (id: string): void => {
    states.value.selectedTab = id
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

    snapshot()

    hotkeys.setScope('edit')
  }

  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
    unselectTable()
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
      await api.service('menus').patch(userMenus.value._id, {
        ...userMenus.value,
        list: states.value.menus,
      }),
    )

    states.value.tables = cloneDeep(
      await api.service('tables').patch(userTables.value._id, {
        ...userTables.value,
        list: states.value.tables,
      }),
    )

    states.value.forms = cloneDeep(
      await api.service('forms').patch(userForms.value._id, {
        ...userForms.value,
        list: states.value.forms,
      }),
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
  }
})

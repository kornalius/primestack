import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import hotkeys from 'hotkeys-js'
import { useFeathers } from '@/composites/feathers'
import cloneDeep from 'lodash/cloneDeep'
import useSnacks from '@/features/Snacks/composites'

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

  const startEdit = (): void => {
    states.value.active = true

    const { api } = useFeathers()

    const userMenus = api.service('menus').findOneInStore({ query: {} })
    const userForms = api.service('forms').findOneInStore({ query: {} })
    const userTables = api.service('tables').findOneInStore({ query: {} })

    states.value.menus = cloneDeep(userMenus.value?.list)
    states.value.forms = cloneDeep(userForms.value?.list)
    states.value.tables = cloneDeep(userTables.value?.list)

    hotkeys.setScope('edit')
  }

  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
    unselectTable()
    states.value.selected = undefined
    hotkeys.setScope('app')
  }

  const save = (): void => {
    const { api } = useFeathers()

    const userMenus = api.service('menus').findOneInStore({ query: {} })
    const userForms = api.service('forms').findOneInStore({ query: {} })
    const userTables = api.service('tables').findOneInStore({ query: {} })

    api.service('menus').patch(userMenus.value._id, {
      ...userMenus.value,
      list: states.value.menus,
    })

    api.service('tables').patch(userTables.value._id, {
      ...userTables.value,
      list: states.value.tables,
    })

    api.service('forms').patch(userForms.value._id, {
      ...userForms.value,
      list: states.value.forms,
    })

    const snacks = useSnacks()
    snacks.pushSuccess('Saved successfully')
  }

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
  }
})

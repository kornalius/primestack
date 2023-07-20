import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('app-editor', () => {
  const states = ref({
    active: false,
    selectedMenu: undefined,
    selectedTab: undefined,
    selectedSchema: undefined,
    selectedSchemaField: undefined,
    selected: undefined,
    hovered: undefined,
    dragging: false,
    formId: undefined,
  })

  const active = computed(() => states.value.active)
  const selected = computed(() => states.value.selected)
  const formId = computed(() => states.value.formId)
  const selectedMenu = computed(() => states.value.selectedMenu)
  const selectedTab = computed(() => states.value.selectedTab)
  const selectedSchema = computed(() => states.value.selectedSchema)
  const selectedSchemaField = computed(() => states.value.selectedSchemaField)

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

  const selectSchema = (id: string): void => {
    states.value.selectedSchema = id
  }

  const unselectSchema = (): void => {
    states.value.selectedSchema = undefined
  }

  const isSchemaSelected = (id: string): boolean => (
    states.value.selectedSchema === id
  )

  const selectSchemaField = (id: string): void => {
    states.value.selectedSchemaField = id
  }

  const unselectSchemaField = (): void => {
    states.value.selectedSchemaField = undefined
  }

  const isSchemaFieldSelected = (id: string): boolean => (
    states.value.selectedSchemaField === id
  )

  const startEdit = (): void => {
    states.value.active = true
  }

  const endEdit = (): void => {
    states.value.active = false
    unselectMenu()
  }

  return {
    states,
    active,
    selectedMenu,
    selectedTab,
    selected,
    selectedSchema,
    selectedSchemaField,
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
    selectSchema,
    unselectSchema,
    isSchemaSelected,
    selectSchemaField,
    unselectSchemaField,
    isSchemaFieldSelected,
  }
})

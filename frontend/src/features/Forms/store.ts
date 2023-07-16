import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('form-editor', () => {
  const states = ref({
    selected: undefined,
    hovered: undefined,
    dragging: false,
  })

  const selected = computed(() => states.value.selected)

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

  return {
    states,
    selected,
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
  }
})

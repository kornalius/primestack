import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useJsonEditor = defineStore('json-editor', () => {
  const states = ref({
    dragging: false,
    expandedPaths: [],
    focusedPath: undefined,
  })

  const dragging = computed(() => states.value.dragging)

  const expandedPaths = computed(() => states.value.expandedPaths)

  const focusedPath = computed(() => states.value.focusedPath)

  const setDragging = (d: boolean) => {
    states.value.dragging = d
  }

  const isPathExpanded = (path: string) => (
    states.value.expandedPaths.includes(path)
  )

  const expandPath = (path: string) => {
    if (!states.value.expandedPaths.includes(path)) {
      states.value.expandedPaths = [...states.value.expandedPaths, path]
    }
  }

  const collapsePath = (path: string) => {
    const idx = states.value.expandedPaths.indexOf(path)
    if (idx !== -1) {
      states.value.expandedPaths = [
        ...states.value.expandedPaths.slice(0, idx),
        ...states.value.expandedPaths.slice(idx + 1),
      ]
    }
  }

  const togglePath = (path: string) => {
    if (isPathExpanded(path)) {
      collapsePath(path)
    } else {
      expandPath(path)
    }
  }

  const setFocusedPath = (path: string) => {
    states.value.focusedPath = path
  }

  return {
    states,
    dragging,
    setDragging,
    expandedPaths,
    isPathExpanded,
    expandPath,
    collapsePath,
    togglePath,
    focusedPath,
    setFocusedPath,
  }
})

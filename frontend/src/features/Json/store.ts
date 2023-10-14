import {
  computed, Ref, ref, watch, WatchStopHandle,
} from 'vue'
import hotkeys from 'hotkeys-js'
import cloneDeep from 'lodash/cloneDeep'
import { defineStore } from 'pinia'
import { useUndo } from '@/features/Undo/store'
import { AnyData } from '@/shared/interfaces/commons'

export type JSON = AnyData | AnyData[]

let previousScope: string

export const useJsonEditor = defineStore('json-editor', () => {
  const states = ref({
    active: false,
    dragging: false,
    expandedPaths: [] as string[],
    focusedPath: undefined,
    jsonFn: undefined as (d?: JSON) => Ref<JSON> | undefined,
  })

  const undoStore = useUndo('json-undo')()

  /**
   * Returns true if a JSON editing session is in progress
   */
  const active = computed(() => states.value.active)

  /**
   * Returns true if JSON Array item is being dragged
   */
  const dragging = computed(() => states.value.dragging)

  /**
   * Returns all expanded paths
   */
  const expandedPaths = computed(() => states.value.expandedPaths)

  /**
   * Returns the focused path
   */
  const focusedPath = computed(() => states.value.focusedPath)

  /**
   * Creates a snapshot of the current editing json data
   */
  const snapshot = (): JSON => (
    cloneDeep(states.value.jsonFn().value)
  )

  /**
   * Starts watching for changes in the editing session.
   * If changed, creates a snapshot in the undo stack.
   */
  const startWatch = (): WatchStopHandle => watch(
    states.value.jsonFn(),
    undoStore.snap(snapshot),
    { deep: true },
  )

  /**
   * Start a JSON editing session
   *
   * @param jsonFn Function to get and set JSON data
   */
  const startEdit = (jsonFn: (d?: JSON) => Ref<JSON> | undefined) => {
    states.value.active = true
    states.value.jsonFn = jsonFn
    previousScope = hotkeys.getScope()
    undoStore.startWatch(startWatch)
    undoStore.snap(snapshot)()
    hotkeys.setScope('json')
  }

  /**
   * Ends a JSON editing session
   */
  const endEdit = () => {
    undoStore.cancelWatch()
    states.value.active = false
    states.value.jsonFn = undefined
    undoStore.clearUndoStack()
    hotkeys.setScope(previousScope)
  }

  /**
   * Set dragging of JSON element
   *
   * @param d Is dragging on or off?
   */
  const setDragging = (d: boolean) => {
    states.value.dragging = d
  }

  /**
   * Check if the path is expanded
   *
   * @param path Path for the element in the JSON object
   *
   * @return {boolean}
   */
  const isPathExpanded = (path: string): boolean => (
    states.value.expandedPaths.includes(path)
  )

  /**
   * Expands a path
   *
   * @param path Path for the element in the JSON object
   */
  const expandPath = (path: string) => {
    if (!states.value.expandedPaths.includes(path)) {
      states.value.expandedPaths = [...states.value.expandedPaths, path]
    }
  }

  /**
   * Collapse a path
   *
   * @param path Path for the element in the JSON object
   */
  const collapsePath = (path: string) => {
    const idx = states.value.expandedPaths.indexOf(path)
    if (idx !== -1) {
      states.value.expandedPaths = [
        ...states.value.expandedPaths.slice(0, idx),
        ...states.value.expandedPaths.slice(idx + 1),
      ]
    }
  }

  /**
   * Collapse or expand a path
   *
   * @param path Path for the element in the JSON object
   */
  const togglePath = (path: string) => {
    if (isPathExpanded(path)) {
      collapsePath(path)
    } else {
      expandPath(path)
    }
  }

  /**
   * Sets the focused path (for editing)
   *
   * @param path Path for the element in the JSON object
   */
  const setFocusedPath = (path: string) => {
    states.value.focusedPath = path
  }

  /**
   * Undo current changes to the last snapshot
   */
  const undo = (): boolean => {
    if (undoStore.undo()) {
      states.value.jsonFn(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
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
      states.value.jsonFn(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
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

  return {
    states,
    active,
    dragging,
    setDragging,
    expandedPaths,
    isPathExpanded,
    expandPath,
    collapsePath,
    togglePath,
    focusedPath,
    setFocusedPath,
    startEdit,
    endEdit,
    snap: undoStore.snap,
    canUndo: undoStore.canUndo,
    undo,
    canRedo: undoStore.canRedo,
    redo,
    preventSystemUndoRedo,
  }
})

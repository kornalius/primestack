import {
  computed, Ref, ref, watch, WatchStopHandle,
} from 'vue'
import get from 'lodash/get'
import set from 'lodash/set'
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
    focusedKey: undefined,
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
   * Returns the focused key
   */
  const focusedKey = computed(() => states.value.focusedKey)

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
   * Sets the focused key (for editing)
   *
   * @param path Path for the element in the JSON object
   */
  const setFocusedKey = (path: string) => {
    states.value.focusedKey = path
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

  const itemType = (path: string): string => {
    if (typeof states.value.jsonFn !== 'function') {
      return 'string'
    }

    const json = states.value.jsonFn()
    const item = path ? get(json.value, path) : json.value

    if (Array.isArray(item)) {
      return 'array'
    }
    if (item === null) {
      return 'null'
    }
    if (item === undefined) {
      return 'undefined'
    }
    if (typeof item === 'object') {
      return 'object'
    }
    return typeof item
  }

  const changeType = (path: string, type: string) => {
    if (typeof states.value.jsonFn !== 'function') {
      return
    }

    const json = states.value.jsonFn()
    const item = path ? get(json.value, path) : json.value
    const t = itemType(path)

    if (type === 'string') {
      if (['array', 'object'].includes(t)) {
        set(json.value, path, '')
      } else {
        set(json.value, path, (item || '').toString())
      }
    } else if (type === 'number') {
      set(json.value, path, Number(item) || 0)
    } else if (type === 'boolean') {
      if (item === 'true') {
        set(json.value, path, true)
      } else if (item === 'false') {
        set(json.value, path, true)
      } else {
        set(json.value, path, item === 1)
      }
    } else if (type === 'array') {
      set(json.value, path, [item])
    } else if (type === 'object') {
      set(json.value, path, { key: item })
    } else if (type === 'null') {
      set(json.value, path, null)
    } else if (type === 'undefined') {
      set(json.value, path, undefined)
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
    focusedKey,
    setFocusedPath,
    setFocusedKey,
    startEdit,
    endEdit,
    snap: undoStore.snap,
    canUndo: undoStore.canUndo,
    undo,
    canRedo: undoStore.canRedo,
    redo,
    preventSystemUndoRedo,
    itemType,
    changeType,
  }
})

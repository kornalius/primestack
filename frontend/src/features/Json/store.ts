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
import compact from 'lodash/compact'

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
   * Get the value of a path
   *
   * @param path Path to get
   *
   * @return {AnyData|AnyData[]}
   */
  const getPath = (path: string): AnyData | AnyData[] => {
    const json = states.value.jsonFn().value
    return path === '' ? json : get(json, path)
  }

  /**
   * Set the value of a path
   *
   * @param path Path
   * @param value Value to set
   */
  const setPath = (path: string, value: unknown) => {
    const json = states.value.jsonFn()
    if (path === '' || path === undefined) {
      json.value = value
    } else {
      set(json.value, path, value)
    }
  }

  /**
   * Returns the parent path string
   *
   * @param path Path
   *
   * @return {string}
   */
  const parentPath = (path: string): string => {
    const p = (path || '').split('.')
    p.pop()
    return p.join('.')
  }

  /**
   * Returns the last part of the path string
   *
   * @param path Path
   *
   * @return {string}
   */
  const lastPath = (path: string): string => {
    const p = (path || '').split('.')
    return p?.[p.length - 1]
  }

  /**
   * Deconstruct a path into its parent path, key
   *
   * @param path Path
   *
   * @returns {{ ppath: string, parent: AnyData | AnyData[], key: string}}
   */
  const deconstructParentPath = (path: string): {
    ppath: string,
    parent: AnyData | AnyData[],
    key: string,
  } => {
    const ppath = parentPath(path)
    const parent = getPath(ppath)
    return { ppath, parent, key: lastPath(path) }
  }

  /**
   * Returns a sequentially named key that is not a duplicate key of the object at path
   *
   * @param path Path
   *
   * @return {string}
   */
  const newKey = (path: string): string => {
    const keys = Object.keys(getPath(path))
    let i = 1
    let k = `key${i}`
    while (keys.indexOf(k) !== -1) {
      k = `key${i}`
      i += 1
    }
    return k
  }

  const valueInputForPath = (path: string): HTMLInputElement | undefined => (
    document.querySelector(`#json-value-${path.split('.').join('-')} input`)
  )

  const focusValueInputForPath = (path: string): boolean => {
    const el = valueInputForPath(path)
    if (el) {
      el.focus()
    }
    return el !== undefined
  }

  const keyInputForPath = (path: string): HTMLInputElement | undefined => (
    document.querySelector(`#json-key-${path.split('.').join('-')} input`)
  )

  const focusKeyInputForPath = (path: string): boolean => {
    const el = keyInputForPath(path)
    if (el) {
      el.focus()
    }
    return el !== undefined
  }

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

  const expandTo = (path: string) => {
    const pp = []
    path.split('.').forEach((p) => {
      pp.push(p)
      expandPath(pp.join('.'))
    })
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
    const { ppath, key } = deconstructParentPath(focusedPath.value)
    if (undoStore.undo()) {
      states.value.jsonFn(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
      const parent = getPath(ppath)
      if (Array.isArray(parent)) {
        const idx = Number(key || -1)
        if (idx !== -1) {
          const pathToFocus = compact([...ppath.split('.'), idx]).join('.')
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      } else if (typeof parent === 'object') {
        const keys = Object.keys(parent)
        const idx = keys.indexOf(key)
        if (idx !== -1) {
          const pathToFocus = compact([...ppath.split('.'), keys[idx - 1]]).join('.')
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      }
      setTimeout(() => undoStore.startWatch(startWatch), 100)
      return true
    }
    return false
  }

  /**
   * Redo changes
   */
  const redo = (): boolean => {
    const { ppath, key } = deconstructParentPath(focusedPath.value)
    if (undoStore.redo()) {
      states.value.jsonFn(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
      const parent = getPath(ppath)
      if (Array.isArray(parent)) {
        const idx = Number(key || -1)
        if (idx !== -1) {
          const pathToFocus = compact([...ppath.split('.'), idx]).join('.')
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      } else if (typeof parent === 'object') {
        const keys = Object.keys(parent)
        const idx = keys.indexOf(key)
        if (idx !== -1) {
          const pathToFocus = compact([...ppath.split('.'), keys[idx]]).join('.')
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      }
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
   * Get the item type at path
   *
   * @param path Path
   *
   * @returns {string} Item type (string, number, boolean, null, array, object)
   */
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

  /**
   * Change the type of a key
   *
   * @param path Path
   * @param type Type (string, number, boolean, null, array, object)
   *
   * @returns {boolean} if the type change was successfull or not
   */
  const changeType = (path: string, type: string): boolean => {
    if (typeof states.value.jsonFn !== 'function') {
      return false
    }

    const json = states.value.jsonFn()
    const item = path ? get(json.value, path) : json.value
    const t = itemType(path)

    if (type === 'string') {
      if (t === 'array') {
        setPath(path, item.join(' '))
      } else if (t === 'object') {
        setPath(path, '')
      } else {
        setPath(path, (item || '').toString())
      }
      return true
    }

    if (type === 'number') {
      setPath(path, Number(item) || 0)
      return true
    }

    if (type === 'boolean') {
      if (item === 'true') {
        setPath(path, true)
      } else if (item === 'false') {
        setPath(path, true)
      } else {
        setPath(path, item === 1)
      }
      return true
    }

    if (type === 'array') {
      setPath(path, [item])
      return true
    }

    if (type === 'object') {
      setPath(path, { key: item })
      return true
    }

    if (type === 'null') {
      setPath(path, null)
      return true
    }

    if (type === 'undefined') {
      setPath(path, undefined)
      return true
    }

    return false
  }

  /**
   * Focus on to a specific parent path and its key/index
   *
   * @param path Parent path
   * @param k Key or index
   */
  const focusTo = (path: string, k: string | number): true => {
    expandTo(path)
    const pathToFocus = compact([...path.split('.'), k]).join('.')
    setFocusedPath(pathToFocus)
    focusValueInputForPath(pathToFocus)
    return true
  }

  /**
   * Remove a key path from its parent
   *
   * @param path Path to remove
   *
   * @returns {boolean} if the remove was successfull or not
   */
  const remove = (path: string): boolean => {
    const { ppath, parent, key } = deconstructParentPath(path)
    if (Array.isArray(parent)) {
      const idx = Number(key || -1)
      if (idx !== -1) {
        parent.splice(idx, 1)
        return focusTo(ppath, Math.min(parent.length - 1, idx))
      }
    }
    if (typeof parent === 'object') {
      const idx = Object.keys(parent).indexOf(key)
      if (idx !== -1) {
        delete parent[key]
        const newKeys = Object.keys(parent)
        return focusTo(ppath, newKeys[Math.min(newKeys.length - 1, idx)])
      }
    }
    return false
  }

  /**
   * Inserts an item or key before a path
   *
   * @param path Path
   *
   * @returns {boolean} if the insert was successfull or not
   */
  const insertBefore = (path: string): boolean => {
    const { ppath, parent, key } = deconstructParentPath(path)
    if (Array.isArray(parent)) {
      const idx = Number(key || -1)
      if (idx !== -1) {
        parent.splice(idx, 0, null)
        return focusTo(ppath, Math.max(0, idx - 1))
      }
    }
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const nk = newKey(ppath)
      const idx = keys.indexOf(key)
      if (idx !== -1) {
        const tempKeys = idx === 0
          ? [nk, ...keys]
          : [...keys.slice(0, idx), nk, ...keys.slice(idx)]
        setPath(ppath, tempKeys.reduce((acc, k) => (
          { ...acc, [k]: parent[k] || null }
        ), {}))
        return focusTo(ppath, nk)
      }
    }
    return false
  }

  /**
   * Inserts an item or key after a path
   *
   * @param path Path
   *
   * @returns {boolean} if the insert was successfull or not
   */
  const insertAfter = (path: string): boolean => {
    const { ppath, parent, key } = deconstructParentPath(path)
    if (Array.isArray(parent)) {
      const idx = Number(key || -1)
      if (idx !== -1) {
        parent.splice(idx + 1, 0, null)
        return focusTo(ppath, Math.min(parent.length - 1, idx + 1))
      }
    }
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const nk = newKey(ppath)
      const idx = keys.indexOf(key)
      if (idx !== -1) {
        const tempKeys = idx === keys.length - 1
          ? [...keys, nk]
          : [...keys.slice(0, idx + 1), nk, ...keys.slice(idx + 1)]
        setPath(ppath, tempKeys.reduce((acc, k) => (
          { ...acc, [k]: parent[k] || null }
        ), {}))
        return focusTo(ppath, nk)
      }
    }
    return false
  }

  /**
   * Inserts a child item or key into a path
   *
   * @param path Path
   *
   * @returns {boolean} if the insert was successfull or not
   */
  const insertChild = (path: string): boolean => {
    const p = getPath(path)
    if (Array.isArray(p)) {
      p.push(null)
      return focusTo(path, p.length - 1)
    }
    if (typeof p === 'object' && p !== null) {
      const keys = Object.keys(p)
      const nk = newKey(path)
      const idx = keys.length
      const tempKeys = idx === keys.length - 1
        ? [...keys, nk]
        : [...keys.slice(0, idx + 1), nk, ...keys.slice(idx + 1)]
      setPath(path, tempKeys.reduce((acc, k) => (
        { ...acc, [k]: p[k] || null }
      ), {}))
      return focusTo(path, nk)
    }
    return false
  }

  /**
   * Rename a key from a path
   *
   * @param path Path
   * @param nKey New key name
   *
   * @returns {boolean} if the rename was successfull or not
   */
  const renameKey = (path: string, nKey: string): boolean => {
    const { ppath, parent, key } = deconstructParentPath(path)
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const idx = keys.indexOf(key)
      if (idx !== -1) {
        setPath(ppath, keys.reduce((acc, k, index) => {
          const same = index === idx
          return {
            ...acc,
            [same ? nKey : k]: parent[same ? key : k],
          }
        }, {}))
        return true
      }
    }
    return false
  }

  /**
   * Handle keydown events for the Json Editor HTML elements
   *
   * @param e Keyboard event
   */
  const keydown = (e: KeyboardEvent) => {
    preventSystemUndoRedo(e)

    const path = focusedPath.value
    if (path && path.length > 0) {
      if (e.key === '$' && e.ctrlKey) {
        changeType(path, 'string')
        e.preventDefault()
      } else if (e.key === '!' && e.ctrlKey) {
        changeType(path, 'boolean')
        e.preventDefault()
      } else if (e.key === '#' && e.ctrlKey) {
        changeType(path, 'number')
        e.preventDefault()
      } else if (e.key === ')' && e.ctrlKey) {
        changeType(path, 'null')
        e.preventDefault()
      } else if (e.key === '[' && e.ctrlKey) {
        changeType(path, 'array')
        e.preventDefault()
      } else if (e.key === '{' && e.ctrlKey) {
        changeType(path, 'object')
        e.preventDefault()
      } else if (e.key === 'Delete' && e.ctrlKey) {
        remove(path)
        e.preventDefault()
      } else if (e.key === 'Enter' && !e.altKey && !e.ctrlKey) {
        insertAfter(path)
        e.preventDefault()
      } else if (e.key === 'Enter' && e.altKey && !e.ctrlKey) {
        insertBefore(path)
        e.preventDefault()
      } else if (e.key === 'Enter' && e.ctrlKey) {
        insertChild(path)
        e.preventDefault()
      }
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
    remove,
    insertBefore,
    insertAfter,
    insertChild,
    renameKey,
    keydown,
    keyInputForPath,
    focusKeyInputForPath,
    valueInputForPath,
    focusValueInputForPath,
  }
})

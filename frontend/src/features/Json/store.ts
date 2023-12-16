import {
  Ref, ref, watch, WatchStopHandle,
} from 'vue'
import get from 'lodash/get'
import set from 'lodash/set'
import hotkeys from 'hotkeys-js'
import cloneDeep from 'lodash/cloneDeep'
import { defineStore } from 'pinia'
import { useUndo } from '@/features/Undo/store'
import { AnyData } from '@/shared/interfaces/commons'

export type JSON = AnyData | AnyData[]

let previousHotkeysScope: string

export const useJsonEditor = defineStore('json-editor', () => {
  /**
   * Returns true if a JSON editing session is in progress
   */
  const active = ref(false)

  /**
   * Returns true if JSON Array item is being dragged
   */
  const dragging = ref(false)

  /**
   * Returns all expanded paths
   */
  const expandedPaths = ref([]) as Ref<string[]>

  /**
   * Returns the focused path
   */
  const focusedPath = ref() as Ref<string>

  /**
   * Returns the focused key
   */
  const focusedKey = ref() as Ref<string>

  const jsonFn = ref() as Ref<(d?: JSON) => Ref<JSON> | undefined>

  const undoStore = useUndo('json-undo')()

  /**
   * Build a path from arguments (array, strings and numbers)
   *
   * @param args Arguments {array|string|number}
   *
   * @returns {string}
   */
  const buildPath = (...args: unknown[]): string => {
    const p = []
    args.forEach((a) => {
      if (a !== undefined && a !== null) {
        if (Array.isArray(a)) {
          a.forEach((v) => p.push(v))
        } else if (typeof a === 'string') {
          a.split('.').forEach((v) => {
            if (v !== '') {
              p.push(v)
            }
          })
        } else {
          p.push(a)
        }
      }
    })
    return p.join('.')
  }

  /**
   * Get the value of a path
   *
   * @param path Path to get
   *
   * @return {AnyData|AnyData[]}
   */
  const getPathValue = (path: string): unknown => {
    const json = jsonFn.value().value
    return path === '' || path === undefined ? json : get(json, path)
  }

  /**
   * Set the value of a path
   *
   * @param path Path
   * @param value Value to set
   */
  const setPathValue = (path: string, value: unknown) => {
    const json = jsonFn.value()
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
    const parent = getPathValue(ppath)
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
    const keys = Object.keys(getPathValue(path))
    let i = 1
    let k = `key${i}`
    while (keys.indexOf(k) !== -1) {
      k = `key${i}`
      i += 1
    }
    return k
  }

  /**
   * Retrieve the value input element
   *
   * @param path Path
   *
   * @returns {HTMLInputElement}
   */
  const valueInputForPath = (path: string): HTMLInputElement | undefined => (
    document.querySelector(`#json-value-${path.split('.').join('-')} input`)
  )

  /**
   * Focus on the value input element
   *
   * @param path Path
   *
   * @returns {boolean} if was able to focus or not
   */
  const focusValueInputForPath = (path: string): boolean => {
    const el = valueInputForPath(path)
    if (el) {
      el.focus()
    }
    return el !== undefined
  }

  /**
   * Retrieve the key div element
   *
   * @param path Path
   *
   * @returns {HTMLElement}
   */
  const keyInputForPath = (path: string): HTMLElement | undefined => (
    document.querySelector(`#json-key-${path.split('.').join('-')} input`)
  )

  /**
   * Focus on the key input element
   *
   * @param path Path
   *
   * @returns {boolean} if was able to focus or not
   */
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
    cloneDeep(jsonFn.value().value)
  )

  /**
   * Starts watching for changes in the editing session.
   * If changed, creates a snapshot in the undo stack.
   */
  const startWatch = (): WatchStopHandle => watch(
    jsonFn.value(),
    undoStore.snap(snapshot),
    { deep: true },
  )

  /**
   * Start a JSON editing session
   *
   * @param jfn Function to get and set JSON data
   */
  const startEdit = (jfn: (d?: JSON) => Ref<JSON> | undefined) => {
    active.value = true
    jsonFn.value = jfn
    previousHotkeysScope = hotkeys.getScope()
    undoStore.startWatch(startWatch)
    undoStore.snap(snapshot)()
    hotkeys.setScope('json')
  }

  /**
   * Ends a JSON editing session
   */
  const endEdit = () => {
    undoStore.cancelWatch()
    active.value = false
    jsonFn.value = undefined
    undoStore.clearUndoStack()
    hotkeys.setScope(previousHotkeysScope)
  }

  /**
   * Set dragging of JSON element
   *
   * @param d Is dragging on or off?
   */
  const setDragging = (d: boolean) => {
    dragging.value = d
  }

  /**
   * Check if the path is expanded
   *
   * @param path Path for the element in the JSON object
   *
   * @return {boolean}
   */
  const isPathExpanded = (path: string): boolean => (
    expandedPaths.value.includes(path)
  )

  /**
   * Expands a path
   *
   * @param path Path for the element in the JSON object
   */
  const expandPath = (path: string) => {
    if (!expandedPaths.value.includes(path)) {
      expandedPaths.value = [...expandedPaths.value, path]
    }
  }

  /**
   * Collapse a path
   *
   * @param path Path for the element in the JSON object
   */
  const collapsePath = (path: string) => {
    const idx = expandedPaths.value.indexOf(path)
    if (idx !== -1) {
      expandedPaths.value = [
        ...expandedPaths.value.slice(0, idx),
        ...expandedPaths.value.slice(idx + 1),
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
   * Expand all sub-paths in a path
   *
   * @param path Path
   */
  const expandTo = (path: string) => {
    expandPath('')
    const pp = []
    if (path) {
      path.split('.').forEach((p) => {
        pp.push(p)
        expandPath(pp.join('.'))
      })
    }
  }

  /**
   * Sets the focused path (for editing)
   *
   * @param path Path for the element in the JSON object
   */
  const setFocusedPath = (path: string) => {
    focusedPath.value = path
  }

  /**
   * Sets the focused key (for editing)
   *
   * @param path Path for the element in the JSON object
   */
  const setFocusedKey = (path: string) => {
    focusedKey.value = path
  }

  /**
   * Undo current changes to the last snapshot
   */
  const undo = (): boolean => {
    const { ppath, key } = deconstructParentPath(focusedPath.value)
    if (undoStore.undo()) {
      jsonFn.value(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
      const parent = getPathValue(ppath)
      if (Array.isArray(parent)) {
        const idx = Number(key || -1)
        if (idx !== -1) {
          const pathToFocus = buildPath(ppath, idx)
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      } else if (typeof parent === 'object') {
        const keys = Object.keys(parent)
        const idx = keys.indexOf(key)
        if (idx !== -1) {
          const pathToFocus = buildPath(ppath, keys[idx - 1])
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
      jsonFn.value(cloneDeep(undoStore.undoStack[undoStore.undoPtr]))
      const parent = getPathValue(ppath)
      if (Array.isArray(parent)) {
        const idx = Number(key || -1)
        if (idx !== -1) {
          const pathToFocus = buildPath(ppath, idx)
          setFocusedPath(pathToFocus)
          focusValueInputForPath(pathToFocus)
        }
      } else if (typeof parent === 'object') {
        const keys = Object.keys(parent)
        const idx = keys.indexOf(key)
        if (idx !== -1) {
          const pathToFocus = buildPath(ppath, keys[idx])
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
    if (active.value) {
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
    if (typeof jsonFn.value !== 'function') {
      return 'string'
    }

    const json = jsonFn.value()
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
  const changeItemType = (path: string, type: string): boolean => {
    if (typeof jsonFn.value !== 'function') {
      return false
    }

    const json = jsonFn.value()
    const item = path ? get(json.value, path) : json.value
    const t = itemType(path)

    if (type === 'string') {
      if (t === 'array') {
        setPathValue(path, item.join(' '))
      } else if (t === 'object') {
        setPathValue(path, '')
      } else {
        setPathValue(path, (item || '').toString())
      }
      return true
    }

    if (type === 'number') {
      setPathValue(path, Number(item) || 0)
      return true
    }

    if (type === 'boolean') {
      if (item === 'true') {
        setPathValue(path, true)
      } else if (item === 'false') {
        setPathValue(path, true)
      } else {
        setPathValue(path, item === 1)
      }
      return true
    }

    if (type === 'array') {
      if (item !== null) {
        setPathValue(path, [item])
      } else {
        setPathValue(path, [])
      }
      return true
    }

    if (type === 'object') {
      if (item !== null) {
        setPathValue(path, { key: item })
      } else {
        setPathValue(path, {})
      }
      return true
    }

    if (type === 'null') {
      setPathValue(path, null)
      return true
    }

    if (type === 'undefined') {
      setPathValue(path, undefined)
      return true
    }

    return false
  }

  /**
   * Focus on to a specific parent path and its key/index
   *
   * @param path Parent path
   * @param k Key or index
   * @param key Focus on the key field?
   */
  const focusTo = (path: string, k: string | number, key?: boolean): true => {
    expandTo(path)
    const pathToFocus = buildPath(path, k)
    setFocusedPath(pathToFocus)
    if (key) {
      setFocusedKey(pathToFocus)
    }
    setTimeout(() => {
      if (key) {
        focusKeyInputForPath(pathToFocus)
      } else {
        focusValueInputForPath(pathToFocus)
      }
    }, 100)
    return true
  }

  /**
   * Returns a default value for the type provided
   *
   * @param type Type ('string', 'number', 'boolean', 'null', 'array', 'object')
   *
   * @returns {unknown}
   */
  const defaultValueForType = (type: string): unknown => {
    switch (type) {
      case 'string': return ''
      case 'number': return 0
      case 'boolean': return false
      case 'null': return null
      case 'array': return []
      case 'object': return {}
      default: return undefined
    }
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
        collapsePath(path)
        parent.splice(idx, 1)
        const newPaths = [...expandedPaths.value]
        for (let i = idx; i <= parent.length; i++) {
          const epi = expandedPaths.value.indexOf(buildPath(ppath, i))
          if (epi !== -1) {
            newPaths.splice(epi, 1, buildPath(ppath, i - 1))
          }
        }
        expandedPaths.value = newPaths
        return focusTo(ppath, Math.min(parent.length - 1, idx))
      }
    }
    if (typeof parent === 'object') {
      const idx = Object.keys(parent).indexOf(key)
      if (idx !== -1) {
        collapsePath(path)
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
        const type = itemType(buildPath(ppath, idx))
        parent.splice(idx, 0, defaultValueForType(type))
        return focusTo(ppath, Math.max(0, idx))
      }
    }
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const nk = newKey(ppath)
      const idx = keys.indexOf(key)
      if (idx !== -1) {
        const type = itemType(buildPath(ppath, keys[idx]))
        const tempKeys = idx === 0
          ? [nk, ...keys]
          : [...keys.slice(0, idx), nk, ...keys.slice(idx)]
        setPathValue(ppath, tempKeys.reduce((acc, k) => (
          { ...acc, [k]: k !== nk ? parent[k] : defaultValueForType(type) }
        ), {}))
        return focusTo(ppath, nk, true)
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
        const type = itemType(buildPath(ppath, idx))
        parent.splice(idx + 1, 0, defaultValueForType(type))
        return focusTo(ppath, Math.min(parent.length - 1, idx + 1))
      }
    }
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const nk = newKey(ppath)
      const idx = keys.indexOf(key)
      if (idx !== -1) {
        const type = itemType(buildPath(ppath, keys[idx]))
        const tempKeys = idx === keys.length - 1
          ? [...keys, nk]
          : [...keys.slice(0, idx + 1), nk, ...keys.slice(idx + 1)]
        setPathValue(ppath, tempKeys.reduce((acc, k) => (
          { ...acc, [k]: k !== nk ? parent[k] : defaultValueForType(type) }
        ), {}))
        return focusTo(ppath, nk, true)
      }
    }
    return false
  }

  /**
   * Inserts a child item or key into a path
   *
   * @param path Path
   * @param forceType Forced child type
   *
   * @returns {boolean} if the insert was successfull or not
   */
  const insertChild = (path?: string, forceType?: string): boolean => {
    const p = getPathValue(path)
    if (Array.isArray(p)) {
      const newValue = forceType ? defaultValueForType(forceType) : null
      setPathValue(path, [...p, newValue])
      return focusTo(path, p.length)
    }
    if (typeof p === 'object' && p !== null) {
      const keys = Object.keys(p)
      const nk = newKey(path)
      const idx = keys.length
      const tempKeys = idx === keys.length - 1
        ? [...keys, nk]
        : [...keys.slice(0, idx + 1), nk, ...keys.slice(idx + 1)]
      const newValue = forceType ? defaultValueForType(forceType) : null
      setPathValue(path, tempKeys.reduce((acc, k) => (
        { ...acc, [k]: k !== nk ? p[k] : newValue }
      ), {}))
      return focusTo(path, nk, true)
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
    const { ppath, parent, key: oldKey } = deconstructParentPath(path)
    if (typeof parent === 'object') {
      const keys = Object.keys(parent)
      const idx = keys.indexOf(oldKey)
      if (idx !== -1) {
        setPathValue(ppath, keys.reduce((acc, k, index) => {
          const same = index === idx
          return {
            ...acc,
            [same ? nKey : k]: parent[same ? oldKey : k],
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

    if (e.key === 'Enter' && e.ctrlKey && !e.altKey) {
      insertChild(path)
      e.preventDefault()
    }

    if (path && path.length > 0) {
      if (e.key === '$' && e.ctrlKey) {
        changeItemType(path, 'string')
        e.preventDefault()
      } else if (e.key === '!' && e.ctrlKey) {
        changeItemType(path, 'boolean')
        e.preventDefault()
      } else if (e.key === '#' && e.ctrlKey) {
        changeItemType(path, 'number')
        e.preventDefault()
      } else if (e.key === ')' && e.ctrlKey) {
        changeItemType(path, 'null')
        e.preventDefault()
      } else if (e.key === '[' && e.ctrlKey) {
        changeItemType(path, 'array')
        e.preventDefault()
      } else if (e.key === '{' && e.ctrlKey) {
        changeItemType(path, 'object')
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
      }
    }
  }

  return {
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
    changeItemType,
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
    buildPath,
    defaultValueForType,
    setPathValue,
  }
})

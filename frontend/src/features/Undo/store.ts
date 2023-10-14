import {
  ref, computed, WatchStopHandle,
} from 'vue'
import debounce from 'lodash/debounce'
import { defineStore } from 'pinia'

export const useUndo = (name: string) => defineStore(name, () => {
  const states = ref({
    // Undo pointer
    undoPtr: 0,
    // Undo stack
    undoStack: [] as unknown[],
    // Maximum size of the undo stack
    maxUndoStack: 25,
  })

  const undoPtr = computed(() => states.value.undoPtr)

  const undoStack = computed(() => states.value.undoStack)

  const maxUndoStack = computed(() => states.value.maxUndoStack)

  /**
   * Clears the undo stack
   */
  const clearUndoStack = (): void => {
    states.value.undoStack = []
    states.value.undoPtr = 0
  }

  /**
   * Debounced snap function
   */
  const snap = (snapshotFn: () => unknown) => debounce(() => {
    if (states.value.undoStack.length > states.value.maxUndoStack) {
      states.value.undoStack.shift()
    }
    states.value.undoStack = states.value.undoStack.slice(0, states.value.undoPtr + 1)
    states.value.undoStack.push(snapshotFn())
    states.value.undoPtr = states.value.undoStack.length - 1
  }, 250)

  let stopWatchHandle: WatchStopHandle

  /**
   * Starts watching for changes in the editing session.
   * If changed, creates a snapshot in the undo stack.
   */
  const startWatch = (fn: () => WatchStopHandle): void => {
    if (!stopWatchHandle) {
      stopWatchHandle = fn()
    }
  }

  /**
   * Stop watching for changes in the editing session.
   */
  const cancelWatch = (): void => {
    if (stopWatchHandle) {
      stopWatchHandle()
    }
    stopWatchHandle = undefined
  }

  /**
   * Can we undo changes?
   */
  const canUndo = computed(() => (
    states.value.undoPtr > 0
  ))

  /**
   * Undo current changes to the last snapshot
   */
  const undo = (): boolean => {
    if (canUndo.value) {
      cancelWatch()
      states.value.undoPtr -= 1
      return true
    }
    return false
  }

  /**
   * Can we redo changes?
   */
  const canRedo = computed(() => (
    states.value.undoPtr < states.value.undoStack.length - 1
  ))

  /**
   * Redo changes
   */
  const redo = (): boolean => {
    if (canRedo.value) {
      cancelWatch()
      states.value.undoPtr += 1
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
    if (e.ctrlKey && e.shiftKey && e.key === 'Z') {
      redo()
      e.preventDefault()
    } else if (e.ctrlKey && e.key === 'z') {
      undo()
      e.preventDefault()
    }
  }

  return {
    states,
    undoPtr,
    undoStack,
    maxUndoStack,
    clearUndoStack,
    snap,
    canUndo,
    undo,
    canRedo,
    redo,
    startWatch,
    cancelWatch,
    preventSystemUndoRedo,
  }
})

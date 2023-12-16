import {
  ref, computed, Ref, WatchStopHandle,
} from 'vue'
import debounce from 'lodash/debounce'
import { defineStore } from 'pinia'

export const useUndo = (name: string) => defineStore(name, () => {
  // Undo pointer
  const undoPtr = ref(0)

  // Undo stack
  const undoStack = ref([]) as Ref<unknown[]>

  // Maximum size of the undo stack
  const maxUndoStack = ref(25)

  /**
   * Clears the undo stack
   */
  const clearUndoStack = (): void => {
    undoStack.value = []
    undoPtr.value = 0
  }

  /**
   * Debounced snap function
   */
  const snap = (snapshotFn: () => unknown) => debounce(() => {
    if (undoStack.value.length > maxUndoStack.value) {
      undoStack.value.shift()
    }
    undoStack.value = undoStack.value.slice(0, undoPtr.value + 1)
    undoStack.value.push(snapshotFn())
    undoPtr.value = undoStack.value.length - 1
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
    undoPtr.value > 0
  ))

  /**
   * Undo current changes to the last snapshot
   */
  const undo = (): boolean => {
    if (canUndo.value) {
      cancelWatch()
      undoPtr.value -= 1
      return true
    }
    return false
  }

  /**
   * Can we redo changes?
   */
  const canRedo = computed(() => (
    undoPtr.value < undoStack.value.length - 1
  ))

  /**
   * Redo changes
   */
  const redo = (): boolean => {
    if (canRedo.value) {
      cancelWatch()
      undoPtr.value += 1
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

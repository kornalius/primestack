import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { Snack } from '@/shared/interfaces/snacks'

const hideDelay = 5000

export default defineStore('snacks', () => {
  const states = ref([])

  const snacks = computed(() => states.value)
  const count = computed(() => states.value.length)

  const removeAfter = (id: string, delay: number): void => {
    setTimeout(() => {
      const idx = states.value.findIndex((s) => s.id === id)
      if (idx !== -1) {
        states.value.splice(idx, 1)
      }
    }, delay)
  }

  const pushSnack = (payload: Snack): void => {
    const id = hexObjectId()
    states.value.push({
      ...payload,
      id,
    })
    if (payload.level !== 'Error') {
      removeAfter(id, hideDelay)
    }
  }

  const pushWarn = (message: string): void => {
    const id = hexObjectId()
    states.value.push({
      level: 'Warning',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const pushError = (message: string): void => {
    const id = hexObjectId()
    states.value.push({
      level: 'Error',
      message,
      id,
    })
  }

  const pushInfo = (message: string): void => {
    const id = hexObjectId()
    states.value.push({
      level: 'Info',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const pushSuccess = (message: string): void => {
    const id = hexObjectId()
    states.value.push({
      level: 'Success',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const removeSnack = (id: string) => {
    const idx = states.value.findIndex((snack) => snack.id === id)
    if (idx !== -1) {
      states.value.splice(idx, 1)
    }
  }

  const snackClass = (snack: Snack): string => {
    switch (snack.level) {
      case 'Info': return 'bg-info text-white'
      case 'Success': return 'bg-positive'
      case 'Error': return 'bg-negative'
      case 'Warning': return 'bg-warning'
      default: return 'bg-primary text-white'
    }
  }

  return {
    states,
    snacks,
    count,
    pushSnack,
    pushWarn,
    pushError,
    pushInfo,
    pushSuccess,
    removeSnack,
    snackClass,
  }
})

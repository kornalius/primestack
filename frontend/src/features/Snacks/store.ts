import { Ref, computed, ref } from 'vue'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { Snack } from '@/shared/interfaces/snacks'

const hideDelay = 5000

export const useSnacks = defineStore('snacks', () => {
  const snacks = ref([]) as Ref<Snack[]>

  const count = computed(() => snacks.value.length)

  const removeAfter = (id: string, delay: number): void => {
    setTimeout(() => {
      const idx = snacks.value.findIndex((s) => s.id === id)
      if (idx !== -1) {
        snacks.value.splice(idx, 1)
      }
    }, delay)
  }

  const pushSnack = (payload: Snack): void => {
    const id = hexObjectId()
    snacks.value.push({
      ...payload,
      id,
    })
    if (payload.level !== 'Error') {
      removeAfter(id, hideDelay)
    }
  }

  const pushWarn = (message: string): void => {
    const id = hexObjectId()
    snacks.value.push({
      level: 'Warning',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const pushError = (message: string): void => {
    const id = hexObjectId()
    snacks.value.push({
      level: 'Error',
      message,
      id,
    })
  }

  const pushInfo = (message: string): void => {
    const id = hexObjectId()
    snacks.value.push({
      level: 'Info',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const pushSuccess = (message: string): void => {
    const id = hexObjectId()
    snacks.value.push({
      level: 'Success',
      message,
      id,
    })
    removeAfter(id, hideDelay)
  }

  const removeSnack = (id: string) => {
    const idx = snacks.value.findIndex((snack) => snack.id === id)
    if (idx !== -1) {
      snacks.value.splice(idx, 1)
    }
  }

  const snackClass = (snack: Snack): string => {
    switch (snack.level) {
      case 'Info': return 'bg-info'
      case 'Success': return 'bg-positive'
      case 'Error': return 'bg-negative'
      case 'Warning': return 'bg-warning'
      default: return 'bg-primary text-white'
    }
  }

  return {
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

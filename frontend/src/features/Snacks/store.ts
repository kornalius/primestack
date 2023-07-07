import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'
import { Snack } from '@/shared/interfaces/snacks'

export default defineStore('snacks', () => {
  const snackStates = ref([])

  const snacks = computed(() => snackStates.value)
  const count = computed(() => snackStates.value.length)

  const pushSnack = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      id: uuidv4(),
    })
  }

  const pushWarn = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Warning',
      id: uuidv4(),
    })
  }

  const pushError = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Error',
      id: uuidv4(),
    })
  }

  const pushInfo = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Info',
      id: uuidv4(),
    })
  }

  const pushSuccess = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Success',
      id: uuidv4(),
    })
  }

  const popSnack = () => {
    snackStates.value.slice(1)
  }

  const removeSnack = (id: string) => {
    const idx = snackStates.value.findIndex((snack) => snack.id === id)
    if (idx !== -1) {
      snackStates.value.splice(idx, 1)
    }
  }

  return {
    snackStates,
    snacks,
    count,
    pushSnack,
    pushWarn,
    pushError,
    pushInfo,
    pushSuccess,
    popSnack,
    removeSnack,
  }
})

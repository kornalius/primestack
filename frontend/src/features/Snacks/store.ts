import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { Snack } from '@/shared/interfaces/snacks'

export default defineStore('snacks', () => {
  const snackStates = ref([])

  const snacks = computed(() => snackStates.value)
  const count = computed(() => snackStates.value.length)

  const pushSnack = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      id: hexObjectId(),
    })
  }

  const pushWarn = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Warning',
      id: hexObjectId(),
    })
  }

  const pushError = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Error',
      id: hexObjectId(),
    })
  }

  const pushInfo = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Info',
      id: hexObjectId(),
    })
  }

  const pushSuccess = (payload: Snack): void => {
    snackStates.value.push({
      ...payload,
      level: 'Success',
      id: hexObjectId(),
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

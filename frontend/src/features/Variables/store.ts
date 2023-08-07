import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('variables', () => {
  const states = ref({})

  const variableNames = computed(() => Object.keys(states.value))

  const getVariable = (name: string): unknown => states.value[name]

  const setVariable = (name: string, value: unknown): void => {
    states.value[name] = value
  }

  const unsetVariable = (name: string): void => {
    delete states.value[name]
  }

  return {
    states,
    variableNames,
    getVariable,
    setVariable,
    unsetVariable,
  }
})

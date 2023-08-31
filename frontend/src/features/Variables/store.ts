import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useVariables = defineStore('variables', () => {
  const states = ref({})

  const variableNames = computed(() => Object.keys(states.value))

  const variableExists = (name: string): boolean => Object.keys(states.value).includes(name)

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
    variableExists,
    getVariable,
    setVariable,
    unsetVariable,
  }
})

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { useApp } from '@/features/App/store'

export const useVariables = defineStore('variables', () => {
  const states = ref({})

  const app = useApp()

  const storeName = (name: string): string => {
    if (name.startsWith('@')) {
      return name.substring(1)
    }
    return `${app.menuId}-${name}`
  }

  const variableNames = computed(() => Object.keys(states.value))

  const globalNames = computed(() => (
    Object.keys(states.value)
      .filter((n) => !n.startsWith(`${app.menuId}-`))
      .map((n) => `@${n}`)
  ))

  const localNames = computed(() => (
    Object.keys(states.value)
      .filter((n) => n.startsWith(`${app.menuId}-`))
      .map((n) => n.replace(new RegExp(`^${app.menuId}-`), ''))
  ))

  const variableExists = (name: string): boolean => Object.keys(states.value).includes(storeName(name))

  const getVariable = (name: string): unknown => states.value[storeName(name)]

  const setVariable = (name: string, value: unknown): void => {
    states.value[storeName(name)] = value
  }

  const unsetVariable = (name: string): void => {
    delete states.value[storeName(name)]
  }

  return {
    states,
    variableNames,
    globalNames,
    localNames,
    variableExists,
    getVariable,
    setVariable,
    unsetVariable,
  }
})

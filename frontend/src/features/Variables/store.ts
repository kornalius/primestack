import { computed, ref } from 'vue'
import lodashGet from 'lodash/get'
import lodashSet from 'lodash/set'
import lodashUnset from 'lodash/unset'
import { defineStore } from 'pinia'
import { useApp } from '@/features/App/store'

export const useVariables = defineStore('variables', () => {
  const states = ref({
    _scoped: {},
  })

  const app = useApp()

  const isGlobal = (name: string): boolean => name.startsWith('@')

  const isScoped = (name: string): boolean => name.startsWith('$')

  const cleanName = (name: string): string => (
    name.replace(/^!\w+/, '')
  )

  const storeName = (name: string): string => {
    if (isGlobal(name)) {
      return cleanName(name.substring(1))
    }
    if (isScoped(name)) {
      return `_scoped.${cleanName(name.substring(1))}`
    }
    return `${app.menuId}-${cleanName(name)}`
  }

  const values = computed(() => states.value)

  const scopedNames = computed(() => (
    // eslint-disable-next-line no-underscore-dangle
    Object.keys(states.value._scoped || {})
      .filter((n) => !n.startsWith(`${app.menuId}-`) && !n.startsWith('_'))
      .map((n) => `$${n}`)
  ))

  const globalNames = computed(() => (
    Object.keys(states.value)
      .filter((n) => !n.startsWith(`${app.menuId}-`) && !n.startsWith('_'))
      .map((n) => `@${n}`)
  ))

  const localNames = computed(() => (
    Object.keys(states.value)
      .filter((n) => n.startsWith(`${app.menuId}-`))
      .map((n) => n.replace(new RegExp(`^${app.menuId}-`), ''))
  ))

  const names = computed(() => ([
    ...globalNames.value,
    ...localNames.value,
    ...scopedNames.value,
  ]))

  const exists = (name: string): boolean => (
    Object.keys(states.value).includes(storeName(name))
  )

  const get = (name: string): unknown => lodashGet(states.value, storeName(name))

  const set = (name: string, value: unknown): void => {
    lodashSet(states.value, storeName(name), value)
  }

  const unset = (name: string): void => {
    lodashUnset(states.value, storeName(name))
  }

  /**
   * Directly get a variable from the states
   *
   * @param name Pure state key name
   */
  const getRaw = (name: string): unknown => (
    states.value[name]
  )

  /**
   * Directly set a variable from the states
   *
   * @param name Pure state key name
   * @param value New value
   */
  const setRaw = (name: string, value: unknown): void => {
    states.value[name] = value
  }

  /**
   * Directly delete a variable from the states
   *
   * @param name Pure state key name
   */
  const unsetRaw = (name: string): void => {
    delete states.value[name]
  }

  return {
    states,
    values,
    names,
    scopedNames,
    globalNames,
    localNames,
    exists,
    get,
    set,
    unset,
    getRaw,
    setRaw,
    unsetRaw,
  }
})

import {
  computed,
  Ref,
  ref,
  watch,
} from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { AnyData } from '@/shared/interfaces/commons'

const cloneValue = (value: unknown): unknown => (
  Array.isArray(value) || typeof value === 'object'
    ? cloneDeep(value)
    : value
)

/**
 * Creates a new Ref which is initialized with the value of a property
 * and updated when the property value changes.
 */
export const useProp = (props: AnyData, name: string, defaultValue?: unknown): Ref => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = props as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // if (!p[name]) {
  //   return ref()
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = ref(cloneValue(p[name] || defaultValue))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch((): Ref => cloneDeep(p[name]), (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      r.value = cloneValue(newValue)
    }
  })

  return r
}

/**
 * Creates a new Ref which is initialized with the value of a property
 * and updated when the property value changes. When the Ref changes, it
 * emits an update event for .sync property declaration
 */
export const useSyncedProp = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
  name: string,
  emit: (e: string, ...args: unknown[]) => void,
): Ref => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = props as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // if (!p[name]) {
  //   return ref()
  // }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const r = ref(cloneValue(p[name]))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch((): Ref => cloneDeep(p[name]), (newValue, oldValue) => {
    if (!isEqual(newValue, oldValue)) {
      r.value = cloneValue(newValue)
    }
  })

  watch(r, (newValue): void => {
    emit(`update:${name}`, newValue)
  }, { deep: true })

  return r
}

/**
 * Creates a new Ref which is initialized with the model-value property
 * and updated when the property model-value changes. When the Ref changes, it
 * emits an update:model-value with the new value
 */
export const useModelValue = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>,
  emit: (e: string, ...args: unknown[]) => void,
): Ref => computed({
  get: () => props.modelValue,
  set: (value) => emit('update:model-value', value),
})

export default {}

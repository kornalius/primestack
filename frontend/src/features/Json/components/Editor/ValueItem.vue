<template>
  <q-checkbox
    v-if="typeof value === 'boolean'"
    v-model="value"
    dense
  />

  <q-input
    v-else-if="typeof value === 'number'"
    v-model.number="value"
    input-class="text-blue"
    type="number"
    borderless
    dense
  />

  <q-input
    v-else
    v-model="value"
    input-class="text-green"
    borderless
    dense
  />
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: unknown
  parent?: unknown
  itemKey?: string | number
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)
</script>

<style scoped lang="sass">
:deep(.q-field__control)
  background: none !important
</style>

<template>
  <q-checkbox
    v-model="value"
    v-bind="$attrs"
    class="full-width"
    dense
  />
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any | any[];
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: any | any[]): void,
}>()

const value = useModelValue(props, emit)
</script>

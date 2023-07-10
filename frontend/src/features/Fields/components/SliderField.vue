<template>
  <q-slider
    v-model="value"
    v-bind="$attrs"
    dense
    outlined
  />
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: number | null | undefined;
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: number | null | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

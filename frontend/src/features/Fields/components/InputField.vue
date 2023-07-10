<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    dense
    outlined
  />
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | number | null | undefined;
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | number | null | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

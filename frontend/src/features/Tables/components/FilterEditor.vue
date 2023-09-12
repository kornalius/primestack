<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
  >
    <template #append>
      <q-icon name="mdi-magnify" size="xs" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | undefined
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

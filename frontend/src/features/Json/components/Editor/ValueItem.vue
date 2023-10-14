<template>
  <q-checkbox
    v-if="typeof value === 'boolean'"
    v-model="value"
    dense
    @focus="focused = true"
    @blur="focused = false"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="typeof value === 'number'"
    v-model.number="value"
    input-class="text-blue"
    type="number"
    borderless
    dense
    @focus="focused = true"
    @blur="focused = false"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="value === null"
    v-model="value"
    label-color="red"
    :label="focused ? undefined : 'null'"
    borderless
    dense
    @focus="focused = true"
    @blur="focused = false"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="value === undefined"
    v-model="value"
    label-color="brown"
    :label="focused ? undefined : 'undefined'"
    borderless
    dense
    @focus="focused = true"
    @blur="focused = false"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else
    v-model="value"
    input-class="text-green"
    borderless
    dense
    @focus="focused = true"
    @blur="focused = false"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'

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

const jsonEditor = useJsonEditor()

const focused = ref(false)
</script>

<style scoped lang="sass">
:deep(.q-field__control)
  background: none !important
</style>

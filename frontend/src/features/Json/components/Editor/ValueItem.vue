<template>
  <q-checkbox
    v-if="typeof value === 'boolean'"
    v-model="value"
    style="margin-top: 11px;"
    autofocus
    dense
    @focus="focus"
    @blur="blur"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="typeof value === 'number'"
    v-model.number="value"
    input-class="text-blue"
    type="number"
    borderless
    autofocus
    dense
    @focus="focus"
    @blur="blur"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="value === null"
    v-model="value"
    label-color="red"
    :label="focused ? undefined : 'null'"
    borderless
    dense
    autofocus
    @focus="focus"
    @blur="blur"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else-if="value === undefined"
    v-model="value"
    label-color="brown"
    :label="focused ? undefined : 'undefined'"
    borderless
    autofocus
    dense
    @focus="focus"
    @blur="blur"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />

  <q-input
    v-else
    v-model="value"
    input-class="text-green"
    borderless
    autofocus
    dense
    @focus="focus"
    @blur="blur"
    @keydown="jsonEditor.preventSystemUndoRedo"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
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

const pathString = computed(() => props.path.join('.'))

const focus = () => {
  jsonEditor.setFocusedPath(pathString.value)
  focused.value = true
}

const blur = () => {
  jsonEditor.setFocusedPath(undefined)
  focused.value = false
}
</script>

<style scoped lang="sass">
:deep(.q-field__control)
  background: none !important
</style>

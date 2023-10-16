<template>
  <div :id="`json-value-${pathString.split('.').join('-')}`">
    <q-checkbox
      v-if="typeof value === 'boolean'"
      v-model="value"
      style="margin-top: 11px;"
      :autofocus="jsonEditor.focusedPath === pathString"
      dense
      @focus="focus"
      @blur="blur"
      @keydown="jsonEditor.keydown"
      @click.stop=""
    />

    <q-input
      v-else-if="typeof value === 'number'"
      v-model.number="value"
      input-class="text-blue"
      type="number"
      :autofocus="jsonEditor.focusedPath === pathString"
      borderless
      dense
      @focus="focus"
      @blur="blur"
      @keydown="jsonEditor.keydown"
      @click.stop=""
    />

    <q-input
      v-else-if="value === null"
      v-model="value"
      label-color="red"
      :label="focused ? undefined : 'null'"
      :autofocus="jsonEditor.focusedPath === pathString"
      borderless
      dense
      @focus="focus"
      @blur="blur"
      @keydown="jsonEditor.keydown"
      @click.stop=""
    />

    <q-input
      v-else-if="value === undefined"
      v-model="value"
      label-color="brown"
      :label="focused ? undefined : 'undefined'"
      :autofocus="jsonEditor.focusedPath === pathString"
      borderless
      dense
      @focus="focus"
      @blur="blur"
      @keydown="jsonEditor.keydown"
      @click.stop=""
    />

    <q-input
      v-else
      v-model="value"
      input-class="text-green"
      :autofocus="jsonEditor.focusedPath === pathString"
      borderless
      dense
      @focus="focus"
      @blur="blur"
      @keydown="jsonEditor.keydown"
      @click.stop=""
    />
  </div>
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
  setTimeout(() => {
    jsonEditor.setFocusedPath(pathString.value)
  }, 10)
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

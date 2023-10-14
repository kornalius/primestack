<template>
  <div
    v-if="isObjectKey && !focused"
    class="col-auto q-pr-md"
    style="cursor: text;"
    tabindex="0"
    @focus="focus"
  >
    {{ key }}
  </div>

  <div
    v-else-if="isObjectKey && focused"
    class="col-3 q-mr-sm"
  >
    <q-input
      ref="input"
      v-model="key"
      autofocus
      dense
      borderless
      @blur="changeKey"
      @keydown="jsonEditor.preventSystemUndoRedo"
    />
  </div>

  <div
    v-else-if="key !== undefined"
    class="col-auto q-pr-md"
  >
    <span>
      #{{ key }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useJsonEditor } from '@/features/Json/store'

const props = defineProps<{
  modelValue: string | number | undefined
  parent?: unknown
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'change-key', newValue: string, oldValue: string): void,
}>()

const key = ref()

const jsonEditor = useJsonEditor()

watch(() => props.modelValue, () => {
  key.value = props.modelValue
}, { immediate: true })

const changeKey = () => {
  jsonEditor.setFocusedPath(undefined)

  if (key.value !== props.modelValue) {
    emit('change-key', key.value, props.modelValue as string)
  }
}

const input = ref()

const isObjectKey = computed(() => typeof key.value === 'string')

const pathString = computed(() => props.path.join('.'))

const focused = computed(() => jsonEditor.focusedPath === pathString.value)

const focus = () => {
  jsonEditor.setFocusedPath(pathString.value)
  setTimeout(() => {
    input.value.select()
  }, 10)
}
</script>

<style scoped lang="sass">
:deep(.q-field__control)
  background: none !important
</style>

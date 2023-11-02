<template>
  <div
    v-if="isObjectKey && !keyFocused"
    class="col-auto q-pr-md"
    style="cursor: text;"
    tabindex="0"
    @focus="focus"
  >
    {{ key }}
  </div>

  <div
    v-else-if="isObjectKey && keyFocused"
    :id="`json-key-${pathString.split('.').join('-')}`"
    class="col-3 q-mr-sm"
  >
    <q-input
      ref="input"
      v-model="key"
      dense
      borderless
      @focus="focus"
      @blur="changeKey"
      @keydown="jsonEditor.keydown"
      @click.stop=""
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

const emit = defineEmits<{
  (e: 'change-key', newValue: string, oldValue: string): void,
}>()

const key = ref()

const jsonEditor = useJsonEditor()

watch(() => props.modelValue, () => {
  key.value = props.modelValue
}, { immediate: true })

const changeKey = () => {
  jsonEditor.setFocusedKey(undefined)
  jsonEditor.setFocusedPath(undefined)

  if (key.value !== props.modelValue) {
    emit('change-key', key.value, props.modelValue as string)
  }
}

const input = ref()

const isObjectKey = computed(() => typeof key.value === 'string')

const pathString = computed(() => props.path.join('.'))

const keyFocused = computed(() => jsonEditor.focusedKey === pathString.value)

const focus = () => {
  jsonEditor.setFocusedKey(pathString.value)
  setTimeout(() => {
    jsonEditor.setFocusedPath(pathString.value)
    input.value?.getNativeElement().select()
  }, 10)
}
</script>

<style scoped lang="sass">
:deep(.q-field__control)
  background: none !important
</style>

<template>
  <q-editor
    v-model="value"
    v-bind="$attrs"
    :definitions="defs"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import omit from 'lodash/omit'
import { useModelValue } from '@/composites/prop'
import { QEditorCommand } from 'quasar'
import DOMPurify from 'dompurify'

type Definitions = {
  [commandName: string]: QEditorCommand | undefined
}

const props = defineProps<{
  modelValue: string
  definitions: unknown[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string): void,
}>()

const value = useModelValue(props, emit)

const defs = computed((): Definitions => (
  props.definitions?.reduce((acc, d) => (
    { ...acc, [d.name]: omit(d, ['name']) }
  ), {})
) as Definitions)

watch(value, () => {
  const clean = DOMPurify.sanitize(value.value, { USE_PROFILES: { html: true } })
  if (value.value !== clean) {
    value.value = clean
  }
})
</script>

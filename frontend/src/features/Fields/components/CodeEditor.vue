<template>
  <codemirror
    v-model="value"
    style="width: 600px; height: 400px;"
    :autofocus="true"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | null | undefined
  langJson?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const extensions = [oneDark]

if (props.langJson) {
  extensions.push(json())
}

const value = useModelValue(props, emit)

const view = shallowRef()

const handleReady = (payload) => {
  view.value = payload.view
}
</script>

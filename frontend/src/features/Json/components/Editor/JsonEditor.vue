<template>
  <ul>
    <json-item
      v-model="item"
      :path="[]"
    />
  </ul>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, Ref } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import { AnyData } from '@/shared/interfaces/commons'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: AnyData | AnyData[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData | AnyData[]): void,
}>()

const item = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

const json = (d?: AnyData | AnyData[]): Ref<AnyData | AnyData[]> | undefined => {
  if (d) {
    item.value = d
    return undefined
  }
  return item
}

onMounted(() => {
  jsonEditor.startEdit(json)
})

onUnmounted(() => {
  jsonEditor.endEdit()
})
</script>

<style scoped lang="sass">
.json-editor-container
  min-height: 24px

ul
  padding-left: 32px
  list-style-type: none
</style>

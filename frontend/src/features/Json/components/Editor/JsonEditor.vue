<template>
  <div class="json-editor">
    <div
      v-if="showPath"
      class="text-caption"
      style="height: 20px; font-size: 14px;"
    >
      > {{ jsonEditor.focusedPath }}
    </div>

    <ul class="container">
      <json-item
        v-model="item"
        :path="[]"
        :root-child-type="rootChildType"
        :allow-change-root="allowChangeRoot"
        @insert-before="insertBefore"
        @insert-after="insertAfter"
        @insert-child="insertChild"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, Ref } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import { AnyData } from '@/shared/interfaces/commons'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: AnyData | AnyData[]
  allowChangeRoot?: boolean
  showPath?: boolean
  rootChildType?: string
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

const insertBefore = (key: string | number) => {
  jsonEditor.insertBefore(key as string)
}

const insertAfter = (key: string | number) => {
  jsonEditor.insertAfter(key as string)
}

const insertChild = () => {
  jsonEditor.insertChild(undefined, props.rootChildType)
}

onMounted(() => {
  jsonEditor.expandPath('')
})
</script>

<style scoped lang="sass">
.json-editor-container
  min-height: 24px

ul
  padding-left: 32px
  list-style-type: none

.container
  padding-left: 0
</style>

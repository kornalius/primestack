<template>
  <ul class="relative-position">
    <div class="margin" />

    <draggable
      class="array-item-container"
      :list="items"
      :group="{ name: 'array-item' }"
      :animation="150"
      easing="cubic-bezier(1, 0, 0, 1)"
      :item-key="(item) => items.indexOf(item)"
      handle=".drag-handle"
      @start="jsonEditor.setDragging(true)"
      @end="jsonEditor.setDragging(false)"
    >
      <template #item="{ index }">
        <json-item
          v-model="items[index]"
          :item-key="index"
          :parent="items"
          :path="[...path, index]"
          @change-key="(newKey, oldKey) => $emit('change-key', newKey, oldKey)"
          @insert-before="insertBefore"
          @insert-after="insertAfter"
          @remove="remove"
        />
      </template>
    </draggable>
  </ul>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: unknown[]
  parent?: unknown
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'change-key', newValue: string, oldValue: string): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const items = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

const insertBefore = (idx: number) => {
  jsonEditor.insertBefore([...props.path, idx].join('.'))
}

const insertAfter = (idx: number) => {
  jsonEditor.insertAfter([...props.path, idx].join('.'))
}

const remove = (idx: number) => {
  jsonEditor.remove([...props.path, idx].join('.'))
}
</script>

<style scoped lang="sass">
.array-item-container
  min-height: 24px

ul
  padding-left: 32px
  list-style-type: none

.margin
  position: absolute
  left: 8px
  top: 0
  height: calc(100% - 4px)
  width: 8px
  background: $purple-2

</style>

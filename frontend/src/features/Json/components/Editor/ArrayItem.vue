<template>
  <ul class="relative-position">
    <div class="margin" />

    <draggable
      class="array-item-container"
      :list="keys"
      :group="{ name: 'array-item' }"
      :animation="150"
      item-key="_id"
      easing="cubic-bezier(1, 0, 0, 1)"
      handle=".drag-handle"
      @start="jsonEditor.setDragging(true)"
      @end="jsonEditor.setDragging(false)"
      @change="keysChanged"
    >
      <template #item="{ element: item }">
        <json-item
          v-model="items[item.index]"
          :item-key="item.index"
          :parent="items"
          :path="jsonEditor.buildPath(path, item.index).split('.')"
          @change-key="(newKey, oldKey) => $emit('change-key', newKey, oldKey)"
          @insert-before="insertBefore"
          @insert-after="insertAfter"
          @insert-child="insertChild"
          @remove="remove"
        />
      </template>
    </draggable>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import { AnyData } from '@/shared/interfaces/commons'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: unknown[]
  parent?: unknown
  path?: (string | number)[]
}>()

const emit = defineEmits<{
  (e: 'change-key', newValue: string, oldValue: string): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const items = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

const pathString = computed(() => props.path.join('.'))

const insertBefore = (idx: number) => {
  jsonEditor.insertBefore([...props.path, idx].join('.'))
}

const insertAfter = (idx: number) => {
  jsonEditor.insertAfter([...props.path, idx].join('.'))
}

const insertChild = () => {
  jsonEditor.insertChild(props.path.join('.'))
}

const remove = (idx: number) => {
  jsonEditor.remove([...props.path, idx].join('.'))
}

const keys = ref([])

const keysChanged = (evt: AnyData) => {
  if (evt.moved) {
    const path = jsonEditor.buildPath(pathString.value, evt.moved.oldIndex)
    const newPath = jsonEditor.buildPath(pathString.value, evt.moved.newIndex)
    const oldExpanded = jsonEditor.isPathExpanded(path)
    const newExpanded = jsonEditor.isPathExpanded(newPath)
    jsonEditor.collapsePath(path)
    jsonEditor.collapsePath(newPath)
    if (oldExpanded) {
      jsonEditor.expandPath(newPath)
    }
    if (newExpanded) {
      jsonEditor.expandPath(path)
    }
  }
  items.value = keys.value.reduce((acc, key) => ([...acc, items.value[key.index]]), [])
}

watch(items, () => {
  keys.value = items.value.reduce((acc, item, index) => {
    const oldKey = keys.value.find((k) => k.index === index)
    return [
      ...acc,
      {
        _id: oldKey?._id || hexObjectId(),
        index,
      },
    ]
  }, [])
}, { immediate: true })
</script>

<style scoped lang="sass">
.array-item-container
  min-height: 24px

ul
  padding-left: 32px
  list-style-type: none

.margin
  position: absolute
  left: 11px
  top: 0
  height: calc(100% - 4px)
  width: 2px
  background: $purple-2

</style>

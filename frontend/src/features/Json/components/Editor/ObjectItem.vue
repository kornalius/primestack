<template>
  <ul class="relative-position">
    <div class="margin" />

    <json-item
      v-for="(key, index) in keys"
      :key="index"
      v-model="item[key]"
      :item-key="key"
      :parent="item"
      :path="jsonEditor.buildPath(path, key).split('.')"
      @change-key="changeKey"
      @insert-before="insertBefore"
      @insert-after="insertAfter"
      @insert-child="insertChild"
      @remove="remove"
    />
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useJsonEditor } from '@/features/Json/store'
import { AnyData } from '@/shared/interfaces/commons'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: AnyData
  parent?: unknown
  path?: (string | number)[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const item = useModelValue(props, emit)

const jsonEditor = useJsonEditor()

/**
 * Extract only item keys
 */
const keys = computed(() => Object.keys(item.value))

const changeKey = (nk: string, ok: string) => {
  jsonEditor.renameKey([...props.path, ok].join('.'), nk)
}

const insertBefore = (key: string) => {
  jsonEditor.insertBefore([...props.path, key].join('.'))
}

const insertAfter = (key: string) => {
  jsonEditor.insertAfter([...props.path, key].join('.'))
}

const insertChild = () => {
  jsonEditor.insertChild(props.path.join('.'))
}

const remove = (key: string) => {
  jsonEditor.remove([...props.path, key].join('.'))
}
</script>

<style scoped lang="sass">
.object-item-container
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
  background: $grey-4
</style>

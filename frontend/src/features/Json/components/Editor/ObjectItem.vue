<template>
  <ul class="relative-position">
    <div class="margin" />

    <json-item
      v-for="key in keys"
      :key="key"
      v-model="item[key]"
      :item-key="key"
      :parent="item"
      :path="[...path, key]"
      @change-key="changeKey"
      @remove="remove"
    />
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import JsonItem from '@/features/Json/components/Editor/JsonItem.vue'

const props = defineProps<{
  modelValue: AnyData
  parent?: unknown
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const item = useModelValue(props, emit)

/**
 * Extract only item keys
 */
const keys = computed(() => Object.keys(item.value))

const changeKey = (newKey: string, oldKey: string) => {
  const idx = keys.value.indexOf(oldKey)
  item.value = keys.value.reduce((acc, k, index) => {
    if (index === idx) {
      return { ...acc, [newKey]: item.value[oldKey] }
    }
    return { ...acc, [k]: item.value[k] }
  }, {})
}

const remove = (key: string) => {
  const idx = keys.value.indexOf(key)
  item.value = keys.value.reduce((acc, k, index) => {
    if (index !== idx) {
      return { ...acc, [k]: item.value[k] }
    }
    return acc
  }, {})
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
  left: 8px
  top: 0
  height: calc(100% - 4px)
  width: 8px
  background: $grey-4
</style>

<template>
  <ul>
    <json-item
      v-model="item"
      :path="[]"
    />
  </ul>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
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
</script>

<style scoped lang="sass">
.json-editor-container
  min-height: 24px

ul
  padding-left: 32px
  list-style-type: none
</style>

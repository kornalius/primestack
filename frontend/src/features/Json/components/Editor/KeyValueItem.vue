<template>
  <li>
    <div class="row">
      <div class="col-3">
        <key-item
          :model-value="itemKey"
          :parent="parent"
          :path="path"
          @change-key="(newKey, oldKey) => $emit('change-key', newKey, oldKey)"
        />
      </div>

      <div class="col">
        <value-item
          v-model="value"
          :item-key="itemKey"
          :parent="parent"
          :path="path"
        />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import ValueItem from '@/features/Json/components/Editor/ValueItem.vue'
import KeyItem from '@/features/Json/components/Editor/KeyItem.vue'

const props = defineProps<{
  modelValue: unknown
  parent?: unknown
  itemKey?: string | number
  path?: (string | number)[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'change-key', newValue: string, oldValue: string): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)
</script>

<style scoped lang="sass">
.json-editor-container
  min-height: 24px
</style>

<template>
  <div class="row q-gutter-sm">
    <div
      v-for="column in columns"
      :key="column._id"
      :class="{ [colName(column)]: true }"
    >
      <form-display
        v-model="value"
        :fields="column._fields"
        :components="components"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormColumn, TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import FormDisplay from './FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  columns: TFormColumn[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const colName = (column: TFormColumn): string => {
  if (column.col === undefined || column.col === null || column.col === '') {
    return 'col'
  }
  return `col-${column.col}`
}
</script>

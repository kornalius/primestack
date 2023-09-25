<template>
  <div
    class="row q-gutter-sm"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
    :style="style(field)"
  >
    <div
      v-for="column in columns"
      :key="column._id"
      :class="{ [colName(column)]: true }"
      v-bind="fieldBinds(column, schemaForField(column), ctx)"
      :style="style(column)"
    >
      <form-display
        v-model="value"
        :fields="column._fields"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: TFormField
  columns: TFormColumn[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, style, schemaForField } = useFormElements()

const { buildCtx } = useExpression()

const ctx = buildCtx()

const colName = (column: TFormColumn): string => {
  if (column.col === undefined || column.col === null || column.col === '') {
    return 'col'
  }
  return `col-${column.col}`
}
</script>

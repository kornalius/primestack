<template>
  <div
    :class="{
      row: true,
      'q-gutter-sm': true,
      ...(component?.classes || {}),
      ...classBinds(field),
    }"
    :style="{
      ...(component?.styles || {}),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <div
      v-for="column in columns"
      :key="column._id"
      :class="{
        [colName(column)]: true,
        ...(componentsByType.col?.classes || {}),
        ...classBinds(column),
      }"
      :style="{
        ...(componentsByType.col?.styles || {}),
        ...styleBinds(column),
      }"
      v-bind="fieldBinds(column, schemaForField(column), ctx)"
    >
      <form-display
        v-model="value"
        :fields="column._fields as FormField[]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: FormField
  columns: FormColumn[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const {
  componentsByType,
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
} = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
))

const colName = (column: FormColumn): string => {
  const c = column as AnyData
  if (c.col === undefined || c.col === null || c.col === '') {
    return 'col'
  }
  return `col-${c.col}`
}
</script>

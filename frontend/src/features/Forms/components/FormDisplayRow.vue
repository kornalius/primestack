<template>
  <div
    :class="{
      row: true,
      [`q-gutter-x-${(field as any).hGutter}`]: true,
      [`q-gutter-y-${(field as any).vGutter}`]: true,
      [`items-${(field as any).items}`]: true,
      [`justify-${(field as any).justify}`]: true,
      ...objectValue(component?.classes || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.styles || {}, field),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <div
      v-for="column in columns"
      :key="column._id"
      :class="{
        [colName(column)]: true,
        [colBreakName(column)]: true,
        [offsetName(column)]: true,
        ...objectValue(componentsByType.col?.classes || {}, column),
        ...classBinds(column),
      }"
      :style="{
        ...objectValue(componentsByType.col?.styles || {}, column),
        ...styleBinds(column),
      }"
      v-bind="fieldBinds(column, schemaForField(column), ctx)"
    >
      <form-display
        v-if="shouldRender(column)"
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
import { objectValue } from '@/composites/utilities'
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
  colName,
  colBreakName,
  offsetName,
} = useFormElements()

const { t } = useI18n()

const {
  buildCtx,
  isExpr,
  runExpr,
  exprCode,
} = useExpression(t)

const ctx = buildCtx()

const shouldRender = (field: AnyData) => {
  const rw = field.renderWhen
  return !isExpr(rw) || runExpr(exprCode(rw), ctx.$expr)
}

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
))
</script>

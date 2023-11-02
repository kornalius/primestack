<template>
  <q-toolbar
    :class="{
      ...(component?.classes || {}),
      ...classBinds(field),
    }"
    :style="{
      ...(component?.styles || {}),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <form-display
      :model-value="modelValue"
      :fields="fields"
    />
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: unknown[] | undefined
  field: FormField
  columns: FormColumn[]
}>()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const {
  componentsByType,
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
} = useFormElements()

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns[0]._fields as FormField[]
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
))
</script>

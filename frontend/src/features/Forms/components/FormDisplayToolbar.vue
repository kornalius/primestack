<template>
  <q-toolbar
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
    :style="style(field)"
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

// eslint-disable-next-line vue/valid-define-emits
defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const { fieldBinds, style, schemaForField } = useFormElements()

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns[0]._fields as FormField[]
))
</script>

<template>
  <div
    v-for="field in fields"
    :key="field._id"
    class="q-mb-sm"
  >
    <div>
      <form-display-row
        v-if="isRow(field)"
        v-model="value"
        :field="field"
        :columns="field._columns"
      />

      <form-display-tabs
        v-else-if="isTabs(field)"
        v-model="value"
        :field="field"
        :tabs="field._columns"
      />

      <form-display-card
        v-else-if="isCard(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :field="field"
        :columns="field._columns"
      />

      <div
        v-else-if="isParagraph(field)"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :style="style(field)"
        v-html="displayValue(field)"
      />

      <label-field
        v-else-if="isLabel(field)"
        :model-value="displayValue(field) as string"
        :style="style(field)"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <q-icon
        v-else-if="isIcon(field)"
        :name="displayValue(field) as string"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :style="style(field)"
      />

      <!-- Numeric with field -->

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field) && (field as any).field"
        v-model.number="value[(field as any).field]"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Numeric without field -->

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field)"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :model-value="field[modelValueForField(field)]"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Regular with field -->

      <component
        :is="componentForField(field)"
        v-else-if="(field as any).field"
        v-model="value[(field as any).field]"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Regular without field -->

      <component
        :is="componentForField(field)"
        v-else
        :model-value="field[modelValueForField(field)]"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { getProp, useExpression } from '@/features/Expression/composites'
import LabelField from '@/features/Fields/components/LabelField.vue'
import { fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { componentsByType } from '@/features/Components'
import { useFormElements } from '../composites'
import FormDisplayRow from './FormDisplayRow.vue'
import FormDisplayCard from './FormDisplayCard.vue'
import FormDisplayTabs from './FormDisplayTabs.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: FormField[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const { t } = useI18n()

const {
  componentForField,
  fieldBinds,
  style,
  isNumericInput,
  schemaForField,
  isRow,
  isTabs,
  isCard,
  isIcon,
  isParagraph,
  isLabel,
  serializeRules,
} = useFormElements()

const { buildCtx } = useExpression()

const value = useModelValue(props, emit)

const ctx = buildCtx()

const modelValueForField = (field: FormField) => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field._type].modelValueField
)

const displayValue = (field: FormField) => {
  const f = field as AnyData
  return getProp(f.field ? value.value[f.field] : f[modelValueForField(field)], ctx)
}
</script>

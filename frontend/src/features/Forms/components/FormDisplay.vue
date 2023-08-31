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
        :doc="value"
        :columns="field._columns"
        :components="components"
      />

      <form-display-card
        v-else-if="isCard(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
        :field="field"
        :doc="value"
        :columns="field._columns"
        :components="components"
      />

      <div
        v-else-if="isParagraph(field)"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
        :style="style(field)"
        v-html="displayValue(field)"
      />

      <label-field
        v-else-if="isLabel(field)"
        :model-value="displayValue(field) as string"
        :style="style(field)"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
      />

      <q-icon
        v-else-if="isIcon(field)"
        :name="displayValue(field) as string"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
        :style="style"
      />

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field)"
        v-model.number="value[field.field]"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <component
        :is="componentForField(field)"
        v-else
        v-model="value[field.field]"
        v-bind="fieldBinds(field, schemaForType(field), ctx(value))"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { getProp, useExpression } from '@/features/Expression/composites'
import LabelField from '@/features/Fields/components/LabelField.vue'
import { useFormElements } from '../composites'
import FormDisplayRow from './FormDisplayRow.vue'
import FormDisplayCard from './FormDisplayCard.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: TFormField[]
  components: TFormComponent[]
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
  schemaForType,
  isRow,
  isCard,
  isIcon,
  isParagraph,
  isLabel,
  serializeRules,
} = useFormElements()

const { buildCtx } = useExpression()

const value = useModelValue(props, emit)

const ctx = buildCtx()

const displayValue = (field: TFormField) => (
  getProp(field.modelValue || value.value[field.field], ctx(value.value))
)
</script>

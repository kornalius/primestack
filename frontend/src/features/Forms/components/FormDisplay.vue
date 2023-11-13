<template>
  <div
    v-for="field in fields"
    :key="field._id"
    class="q-mb-sm"
    @keydown="(e) => $emit('keydown', e)"
    @keyup="(e) => $emit('keyup', e)"
  >
    <div v-if="shouldRender(field)">
      <!-- Row -->

      <form-display-row
        v-if="isRow(field) && shouldRender(field)"
        v-model="value"
        :field="field"
        :columns="field._columns"
      />

      <!-- List -->

      <form-display-list
        v-else-if="isList(field)"
        v-model="value"
        :field="field"
        :columns="field._columns"
        :horizontal="(field as any).horizontal"
      />

      <!-- Toolbar -->

      <form-display-toolbar
        v-else-if="isToolbar(field)"
        v-model="value"
        :field="field"
        :columns="field._columns"
      />

      <!-- Tabs -->

      <form-display-tabs
        v-else-if="isTabs(field)"
        v-model="value"
        :field="field"
        :tabs="field._columns as FormTab[]"
      />

      <!-- Card -->

      <form-display-card
        v-else-if="isCard(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :field="field"
        :columns="field._columns"
      />

      <!-- Form -->

      <form-embedded
        v-else-if="isEmbeddedForm(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <!-- Paragraph -->

      <div
        v-else-if="isParagraph(field)"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        v-html="displayValue(field)"
      />

      <!-- Label -->

      <label-field
        v-else-if="isLabel(field)"
        :model-value="displayValue(field) as string"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <!-- Icon -->

      <q-icon
        v-else-if="isIcon(field)"
        :name="displayValue(field) as string"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <!-- Numeric with field -->

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field) && (field as any).field"
        v-model.number="value[(field as any).field]"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Numeric without field -->

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field)"
        :model-value="field[modelValueForField(field)]"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Regular with field -->

      <component
        :is="componentForField(field)"
        v-else-if="(field as any).field"
        v-model="value[(field as any).field]"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <!-- Regular without field -->

      <component
        :is="componentForField(field)"
        v-else
        :model-value="field[modelValueForField(field)]"
        :class="{
          ...(componentsByType[field._type]?.classes || {}),
          ...classBinds(field),
        }"
        :style="{
          ...(componentsByType[field._type]?.styles || {}),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, onUpdated } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { fieldSchema, formTabSchema } from '@/shared/schemas/form'
import LabelField from '@/features/Fields/components/LabelField.vue'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { componentsByType } from '@/features/Components'
import { useFormElements } from '../composites'
import FormDisplayRow from './FormDisplayRow.vue'
import FormDisplayCard from './FormDisplayCard.vue'
import FormDisplayTabs from './FormDisplayTabs.vue'
import FormEmbedded from './FormEmbedded.vue'
import FormDisplayList from './FormDisplayList.vue'
import FormDisplayToolbar from './FormDisplayToolbar.vue'

type FormField = Static<typeof fieldSchema>
type FormTab = Static<typeof formTabSchema>

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: FormField[]
}>()

const emit = defineEmits<{
  (e: 'mounted'): void,
  (e: 'updated'): void,
  (e: 'unmounted'): void,
  (e: 'keydown', value: KeyboardEvent): void,
  (e: 'keyup', value: KeyboardEvent): void,
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const { t } = useI18n()

const {
  componentForField,
  fieldBinds,
  classBinds,
  styleBinds,
  isNumericInput,
  schemaForField,
  isRow,
  isList,
  isToolbar,
  isTabs,
  isCard,
  isEmbeddedForm,
  isIcon,
  isParagraph,
  isLabel,
  serializeRules,
} = useFormElements()

const {
  buildCtx,
  getProp,
  isExpr,
  runExpr,
  exprCode,
} = useExpression(t)

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

const shouldRender = (field: FormField) => {
  const rw = (field as AnyData).renderWhen
  return !isExpr(rw) || runExpr(exprCode(rw), ctx.$expr)
}

onMounted(() => {
  setTimeout(() => {
    emit('mounted')
  }, 100)
})

onUpdated(() => {
  emit('updated')
})

onUnmounted(() => {
  emit('unmounted')
})
</script>

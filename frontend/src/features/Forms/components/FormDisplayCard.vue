<template>
  <q-card
    :class="{
      ...objectValue(component?.classes || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.styles || {}, field),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <q-card-section
      v-for="section in cardSections"
      :key="section._id"
      :class="{
        ...objectValue(componentsByType['card-section']?.classes || {}, section),
        ...classBinds(section),
      }"
      :style="{
        ...objectValue(componentsByType['card-section']?.styles || {}, section),
        ...styleBinds(section),
      }"
      v-bind="fieldBinds(section, schemaForField(section), ctx)"
    >
      <form-display
        v-if="shouldRender(section)"
        v-model="value"
        :fields="section._fields as FormField[]"
      />
    </q-card-section>

    <q-card-actions
      v-for="action in cardActions"
      :key="action._id"
      :class="{
        'card-action': true,
        ...objectValue(componentsByType['card-action']?.classes || {}, action),
        ...classBinds(action),
      }"
      :style="{
        'z-index': 1,
        ...objectValue(componentsByType['card-action']?.styles || {}, action),
        ...styleBinds(action),
      }"
      v-bind="fieldBinds(action, schemaForField(action), ctx)"
    >
      <form-display
        v-if="shouldRender(action)"
        v-model="value"
        :fields="action._fields as FormField[]"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { objectValue } from '@/composites/utilities'
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
  isCardActions,
  isCardSection,
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

const cardSections = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((f) => isCardSection(f))
))

const cardActions = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((f) => isCardActions(f))
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
))
</script>

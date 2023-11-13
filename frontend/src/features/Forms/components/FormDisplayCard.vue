<template>
  <q-card
    :class="{
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
    <q-card-section
      v-for="cardSection in cardSections"
      :key="cardSection._id"
      :class="{
        ...(componentsByType['card-section']?.classes || {}),
        ...classBinds(cardSection),
      }"
      :style="{
        ...(componentsByType['card-section']?.styles || {}),
        ...styleBinds(cardSection),
      }"
      v-bind="fieldBinds(cardSection, schemaForField(cardSection), ctx)"
    >
      <form-display
        v-if="shouldRender(cardSection)"
        v-model="value"
        :fields="cardSection._fields as FormField[]"
      />
    </q-card-section>

    <q-card-actions
      v-for="cardAction in cardActions"
      :key="cardAction._id"
      :class="{
        'card-cardAction': true,
        ...(componentsByType['card-action']?.classes || {}),
        ...classBinds(cardAction),
      }"
      :style="{
        'z-index': 1,
        ...(componentsByType['card-action']?.styles || {}),
        ...styleBinds(cardAction),
      }"
      v-bind="fieldBinds(cardAction, schemaForField(cardAction), ctx)"
    >
      <form-display
        v-if="shouldRender(cardAction)"
        v-model="value"
        :fields="cardAction._fields as FormField[]"
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

<template>
  <q-card
    class="q-gutter-sm"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
    :style="style(field)"
  >
    <q-card-section
      v-for="cardSection in cardSections"
      :key="cardSection._id"
      v-bind="fieldBinds(cardSection, schemaForField(cardSection), ctx)"
      :style="style(cardSection)"
    >
      <form-display
        v-model="value"
        :fields="cardSection._fields as FormField[]"
      />
    </q-card-section>

    <q-card-actions
      v-for="cardAction in cardActions"
      :key="cardAction._id"
      :class="{
        'card-cardAction': true,
      }"
      v-bind="fieldBinds(cardAction, schemaForField(cardAction), ctx)"
      style="z-index: 1;"
      :style="style(cardAction)"
    >
      <form-display
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

const { fieldBinds, style, schemaForField } = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const cardSections = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((c) => c._type === 'card-section')
))

const cardActions = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((c) => c._type === 'card-actions')
))
</script>

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
        :fields="cardSection._fields"
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
        :fields="cardAction._fields"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: TFormField
  columns: TFormColumn[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, style, schemaForField } = useFormElements()

const { buildCtx } = useExpression()

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

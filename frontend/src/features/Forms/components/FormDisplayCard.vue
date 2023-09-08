<template>
  <q-card
    class="q-gutter-sm"
    v-bind="bindFields(field)"
    :style="style(field)"
  >
    <q-card-section
      v-for="cardSection in cardSections"
      :key="cardSection._id"
      v-bind="bindFields(cardSection)"
      :style="style(cardSection)"
    >
      <form-display
        v-model="value"
        :fields="cardSection._fields"
        :components="components"
      />
    </q-card-section>

    <q-card-actions
      v-for="cardAction in cardActions"
      :key="cardAction._id"
      :class="{
        'card-cardAction': true,
      }"
      v-bind="bindFields(cardAction)"
      style="z-index: 1;"
      :style="style(cardAction)"
    >
      <form-display
        v-model="value"
        :fields="cardAction._fields"
        :components="components"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: TFormField
  columns: TFormColumn[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, style } = useFormElements()

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

const schemaForType = (f: TFormField | TFormColumn): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)

const bindFields = (field: TFormField | TFormColumn) => (
  fieldBinds(field, schemaForType(field), ctx)
)
</script>

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
        :components="components"
      />

      <form-display-card
        v-else-if="isCard(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForType(field))"
        :field="field"
        :columns="field._columns"
        :components="components"
      />

      <div
        v-else-if="isParagraph(field)"
        v-html="value[field.field]"
      />

      <component
        :is="componentForType[field._type]"
        v-else
        v-model="value[field.field]"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="style(field)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import useFormElements from '../composites'
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

const { componentForType, fieldBinds, style } = useFormElements()

const value = useModelValue(props, emit)

// eslint-disable-next-line no-underscore-dangle
const isRow = (field: TFormField): boolean => field._type === 'row'

// eslint-disable-next-line no-underscore-dangle
const isCard = (field: TFormField): boolean => field._type === 'card'

// eslint-disable-next-line no-underscore-dangle
const isParagraph = (field: TFormField): boolean => field._type === 'paragraph'

const schemaForType = (f: TFormField | TFormColumn): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)
</script>

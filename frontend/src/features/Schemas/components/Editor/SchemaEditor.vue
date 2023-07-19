<template>
  <div>
    <schema-info v-model="value" />

    <section-title class="q-mb-md" title="FIELDS" />

    <array-editor
      v-model="value.fields"
      :add-function="addField"
      :remove-function="removeField"
      add-button="end"
    >
      <template #default="{ index }">
        <schema-field-editor v-model="value.fields[index]" />
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { schema, fieldSchema } from '@/shared/schemas/schema'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import SchemaInfo from '@/features/Schemas/components/Editor/SchemaInfo.vue'
import SchemaFieldEditor from '@/features/Schemas/components/Editor/SchemaField.vue'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'

type Schema = Static<typeof schema>
type SchemaField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: Schema
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Schema): void,
}>()

const value = useModelValue(props, emit)

const addField = () => {
  const field: SchemaField = {
    _id: hexObjectId(),
    name: '',
    type: 'string',
    array: false,
    hidden: false,
    optional: false,
    readonly: false,
    queryable: true,
  }
  value.value.fields.push(field)
}

const removeField = (v: SchemaField, index: number): boolean => {
  value.value.fields.splice(index, 1)
  return true
}
</script>

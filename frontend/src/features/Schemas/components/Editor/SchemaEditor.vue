<template>
  <div>
    <schema-info v-model="value" />

    <array-editor
      v-model="value.fields"
      :add-function="addField"
      :remove-function="removeField"
    >
      <template #default="{ value: field }">
        <schema-field-editor v-model="field" />
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { v4 as uuidv4 } from 'uuid'
import { useModelValue } from '@/composites/prop'
import { schema, schemaField } from '@/shared/schemas/schema'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import SchemaInfo from '@/features/Schemas/components/Editor/SchemaInfo.vue'
import SchemaFieldEditor from '@/features/Schemas/components/Editor/SchemaField.vue'

type Schema = Static<typeof schema>
type SchemaField = Static<typeof schemaField>

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
    _id: uuidv4(),
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

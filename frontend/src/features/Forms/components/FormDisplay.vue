<template>
  <div
    v-for="field in fields"
    :key="field._id"
    class="row q-mb-sm"
  >
    <div class="col">
      <form-display-row
        v-if="isRow(field)"
        v-model="value"
        :columns="field._columns"
        :components="components"
      />

      <div
        v-else-if="isParagraph(field)"
        v-html="value[field.name]"
      />

      <component
        :is="componentForType[field._type]"
        v-else
        v-model="value[field.name]"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="{
          paddingTop: field.padding?.top,
          paddingLeft: field.padding?.left,
          paddingBottom: field.padding?.bottom,
          paddingRight: field.padding?.right,
          marginTop: field.margin?.top,
          marginLeft: field.margin?.left,
          marginBottom: field.margin?.bottom,
          marginRight: field.margin?.right,
        }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import useFormElements from '../composites'
import FormDisplayRow from './FormDisplayRow.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: TFormField[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const { componentForType, fieldBinds } = useFormElements()

const value = useModelValue(props, emit)

// eslint-disable-next-line no-underscore-dangle
const isRow = (field: TFormField): boolean => field._type === 'row'

// eslint-disable-next-line no-underscore-dangle
const isParagraph = (field: TFormField): boolean => field._type === 'paragraph'

const schemaForType = (field: TFormField): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === field._type)?.schema
)
</script>

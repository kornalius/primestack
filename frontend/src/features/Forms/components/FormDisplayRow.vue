<template>
  <div
    class="row q-gutter-sm"
    v-bind="fieldBinds(field, schemaForType(field), ctx)"
    :style="style(field)"
  >
    <div
      v-for="column in columns"
      :key="column._id"
      :class="{ [colName(column)]: true }"
      v-bind="fieldBinds(column, schemaForType(column), ctx)"
      :style="style(column)"
    >
      <form-display
        v-model="value"
        :fields="column._fields"
        :components="components"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TSchema } from '@feathersjs/typebox'
import { useRoute } from 'vue-router'
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { useFeathers } from '@/composites/feathers'
import useVariables from '@/features/Variables/store'
import useFormElements from '../composites'
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

const { api } = useFeathers()

const store = useVariables()

const route = useRoute()

const ctx = {
  api,
  store,
  route,
  doc: value.value,
}

const colName = (column: TFormColumn): string => {
  if (column.col === undefined || column.col === null || column.col === '') {
    return 'col'
  }
  return `col-${column.col}`
}

const schemaForType = (f: TFormField | TFormColumn): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)
</script>

<template>
  <div
    v-for="field in fields"
    :key="field._id"
    class="row q-my-sm"
  >
    <div class="col">
      <form-display-row
        v-if="isRow(field)"
        v-model="value"
        :columns="field.columns"
      />

      <component
        :is="componentsForFieldType[field._type]"
        v-else
        v-model="value[field.name]"
        v-bind="field"
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
        :hint="field.hint === '' ? undefined : field.hint"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useFormElements from '@/features/Form/composites'
import FormDisplayRow from '@/features/Form/components/FormDisplayRow.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: TFormField[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const { componentsForFieldType } = useFormElements()

const value = useModelValue(props, emit)

// eslint-disable-next-line no-underscore-dangle
const isRow = (field: TFormField): boolean => field._type === 'row'
</script>

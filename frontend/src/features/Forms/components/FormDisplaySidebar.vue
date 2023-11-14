<template>
  <sidebar
    v-if="(field as any).field"
    v-model="value[(field as any).field]"
    :class="{
      sidebar: true,
      right: (field as any).right,
      ...objectValue(component?.classes || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.styles || {}, field),
      ...styleBinds(field),
      width: model ? value[(field as any).field] : undefined,
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <form-display
      v-model="value"
      :fields="fields"
    />
  </sidebar>

  <sidebar
    v-else
    v-model="model"
    :class="{
      sidebar: true,
      right: (field as any).right,
      ...objectValue(component?.classes || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.styles || {}, field),
      ...styleBinds(field),
      width: model ? (field as any).sizes.width : undefined,
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <form-display
      v-model="value"
      :fields="fields"
    />
  </sidebar>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { objectValue } from '@/composites/utilities'
import { fieldSchema } from '@/shared/schemas/form'
import Sidebar from '@/features/Fields/components/Sidebar.vue'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: FormField
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const model = ref(false)

const {
  componentsByType,
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
} = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  props.field._columns?.[0]?._fields || []
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
))

watch(() => props.field, () => {
  // eslint-disable-next-line no-underscore-dangle
  model.value = props.field[componentsByType[props.field._type].modelValueField]
}, { immediate: true })

watch(model, () => {
  // eslint-disable-next-line no-underscore-dangle,vue/no-mutating-props
  props.field[componentsByType[props.field._type].modelValueField] = model.value
})
</script>

<style scoped lang="sass">
.sidebar
  position: absolute
  top: 0
  height: 100%
  background: whitesmoke
  z-index: 1000

  &.right
    right: 0
</style>

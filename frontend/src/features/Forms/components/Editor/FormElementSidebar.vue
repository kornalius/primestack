<template>
  <div
    :class="{
      sidebar: true,
      right: (field as any).right,
      ...objectValue(component?.editClasses || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.editStyles || {}, field),
      ...styleBinds(field),
    }"
    @click.stop="$emit('click')"
  >
    <div class="sidebar-column">
      <fields-editor v-model="fields" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { fieldSchema } from '@/shared/schemas/form'
import { objectValue } from '@/composites/utilities'
// eslint-disable-next-line import/no-cycle
import { useFormElements } from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: FormField
}>()

const emit = defineEmits<{
  (e: 'click'): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

const {
  classBinds,
  styleBinds,
  componentsByType,
} = useFormElements()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns?.[0]?._fields || []
))
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.sidebar
  position: absolute
  top: 0
  height: 100%
  min-width: 200px
  width: 100%
  background: whitesmoke
  z-index: 1000

  &.right
    right: 0

.sidebar-column
  position: relative
  padding: 8px 4px 4px 4px
  outline: 1px dashed $blue-grey-2
  border-radius: 4px
  z-index: 1
  height: 100%
</style>

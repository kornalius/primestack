<template>
  <div
    :class="{
      list: true,
      ...objectValue(component?.editClasses || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.editStyles || {}, field),
      ...styleBinds(field),
    }"
    @click.stop="$emit('click')"
  >
    <div class="list-column" style="z-index: 1;">
      <fields-editor v-model="fields" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
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
  componentsByType,
  classBinds,
  styleBinds,
} = useFormElements()

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns?.[0]?._fields || []
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.list
  position: relative
  min-height: 40px
  outline: 1px dashed $blue-grey-2
  border-radius: 4px

.list-column
  position: relative
  margin: 8px 4px
  padding: 8px 4px 4px 4px
  z-index: 1
</style>

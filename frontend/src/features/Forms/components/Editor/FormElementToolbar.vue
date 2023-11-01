<template>
  <q-toolbar
    :class="{
      toolbar: true,
      ...(component?.editClasses || {}),
      ...classBinds(field),
    }"
    :style="{
      ...(component?.editStyles || {}),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <div class="toolbar-column">
      <fields-editor
        v-model="fields"
        horizontal
      />
    </div>
  </q-toolbar>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { fieldSchema } from '@/shared/schemas/form'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: FormField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

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
  field.value._columns[0]._fields as FormField[]
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.toolbar
  position: relative
  min-height: 40px
  outline: 1px dashed $blue-grey-2
  border-radius: 4px

.toolbar-column
  position: relative
  margin: 8px 4px
  width: 100%
  z-index: 1
</style>

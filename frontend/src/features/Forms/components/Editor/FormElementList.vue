<template>
  <div
    class="list"
    :style="{ ...style(field), ...($attrs.style || {}) }"
    @click.stop="$emit('click')"
  >
    <div class="list-column">
      <fields-editor
        v-model="field._columns[0]._fields as FormField[]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { fieldSchema } from '@/shared/schemas/form'
// eslint-disable-next-line import/no-cycle
import { useFormElements } from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: FormField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click'): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

const { style } = useFormElements()
</script>

<style scoped lang="sass">
.list
  position: relative
  min-height: 40px

.list-column
  position: relative
  margin: 8px 4px
  padding: 8px 4px 4px 4px
  z-index: 1
</style>

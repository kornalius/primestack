<template>
  <div class="form-builder-container">
    <draggable
      class="form-builder-inner-container"
      :list="fields"
      :group="{ name: 'form-builder' }"
      :animation="150"
      :direction="horizontal ? 'horizontal' : undefined"
      easing="cubic-bezier(1, 0, 0, 1)"
      item-key="_id"
      @start="editor.setDragging(true)"
      @end="editor.setDragging(false)"
      @change="onChange"
    >
      <template #item="{ index }">
        <form-element
          v-model="fields[index]"
          :selected="editor.isSelected(fields[index]._id)"
          :horizontal="horizontal"
          @click="editor.select"
          @remove="remove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import draggable from 'vuedraggable'
import { AnyData } from '@/shared/interfaces/commons'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { fieldSchema } from '@/shared/schemas/form'
import FormElement from './FormElement.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: unknown[]
  horizontal?: boolean
}>()

const emit = defineEmits<{
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'moved', oldIndex: number, newIndex: number): void,
  (e: 'select', value: unknown): void,
  (e: 'update:model-value', value: unknown[]): void,
  (e: 'update:previewFormData', value: Record<string, unknown>): void,
}>()

const fields = useModelValue(props, emit)

/**
 * Selection
 */

const editor = useAppEditor()

const remove = (field: FormField) => {
  const idx = fields.value.findIndex((v) => v._id === field._id)
  if (idx !== -1) {
    fields.value.splice(idx, 1)
  }
}

/**
 * Draggable
 */

const onChange = (evt: AnyData) => {
  if (evt.added) {
    editor.select(evt.added.element._id)
  }
}
</script>

<style scoped lang="sass">
.form-builder-container
  height: 100%

.form-builder-inner-container
  min-height: 24px
  height: 100%
</style>

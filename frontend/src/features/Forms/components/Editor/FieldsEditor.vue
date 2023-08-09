<template>
  <div>
    <draggable
      :list="fields"
      class="form-builder-container"
      :group="{ name: 'form-builder' }"
      :animation="150"
      easing="cubic-bezier(1, 0, 0, 1)"
      item-key="_id"
      @start="editor.setDragging(true)"
      @end="editor.setDragging(false)"
      @change="onChange"
    >
      <template #item="{ index }">
        <form-element
          v-model="fields[index]"
          :components="components"
          :selected="editor.isSelected(fields[index]._id)"
          @click="editor.select"
          @remove="remove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import FormElement from './FormElement.vue'

const props = defineProps<{
  modelValue: unknown[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
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

const remove = (field: TFormField) => {
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
  min-height: 24px
</style>

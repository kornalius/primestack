<template>
  <div class="row form-row">
    <div
      v-for="column in field.columns"
      :key="column._id"
      :class="{
        [column.col !== '' && column.col !== undefined ? `col-${column.col}` : 'col']: true,
        'form-column': true,
        selected: editor.isSelected(column._id),
      }"
      style="z-index: 1;"
      @mouseover.stop="editor.hover(column._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(column._id)"
      @blur="editor.unhover()"
    >
      <div
        v-if="!editor.isDragging"
        class="overlay"
        @click.stop="onClick(column)"
      />

      <div
        v-if="!editor.isDragging && editor.isHovered(column._id)"
        class="action bg-grey-9 rounded-borders no-pointer-events"
        style="left: 0; width: 18px;"
      >
        <q-icon :name="columnIcon" color="white" size="xs" />
      </div>

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(column._id)"
        class="action"
        style="right: 0;"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(column)"
      />

      <fields-editor
        v-model="column.fields"
        :preview-form-data="previewFormData"
        :components="components"
        :preview="preview"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useFormEditoreditor from '@/features/Form/store'
import FieldsEditor from '@/features/Form/components/Editor/FieldsEditor.vue'

const props = defineProps<{
  modelValue: TFormField
  components: TFormComponent[]
  preview: boolean
  previewFormData: Record<string, unknown>
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: TFormColumn): void,
  (e: 'add', value: TFormColumn): void,
  (e: 'remove', value: TFormColumn): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const field = useModelValue(props, emit)

const columnIcon = computed(() => props.components.find((c) => c.type === 'col').icon)

/**
 * Selection
 */

const editor = useFormEditoreditor()

const onClick = (column: TFormColumn) => {
  emit('click', column)
}

const onRemoveClick = (column: TFormColumn) => {
  emit('remove', column)
}
</script>

<style scoped lang="sass">
.form-row
  position: relative
  min-height: 24px

.form-column
  position: relative
  margin: 8px 4px
  padding: 8px 4px 4px 4px
  border: 1px dashed $blue-grey-5
  border-radius: 4px

  &:first-child
    margin-left: 8px

  &:last-child
    margin-right: 8px

  &.selected
    border: 2px solid $blue-grey-5

.action
  position: absolute
  top: 0
  z-index: 5

.overlay
  position: absolute
  cursor: pointer
  left: 0
  top: 0
  width: 100%
  height: 100%
</style>

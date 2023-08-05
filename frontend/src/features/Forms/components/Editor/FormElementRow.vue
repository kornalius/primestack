<template>
  <div
    class="row form-row"
    v-bind="fieldBinds(field, schemaForType(field))"
    :style="style(field)"
  >
    <div
      v-for="column in field._columns"
      :key="column._id"
      :class="{
        [colName(column)]: true,
        'form-column': true,
        selected: editor.isSelected(column._id),
        hovered: editor.isHovered(column._id),
      }"
      v-bind="fieldBinds(column, schemaForType(column))"
      style="z-index: 1;"
      :style="style(column)"
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
        class="action-button bg-grey-9 rounded-borders no-pointer-events"
        style="left: 0; width: 18px;"
      >
        <q-icon :name="columnIcon" color="white" size="xs" />
      </div>

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(column._id)"
        class="action-button"
        style="right: 0;"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(column)"
      />

      <fields-editor
        v-model="column._fields"
        :components="components"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
// eslint-disable-next-line import/no-cycle
import useFormElements from '@/features/Forms/composites'
import FieldsEditor from './FieldsEditor.vue'

const props = defineProps<{
  modelValue: TFormField
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: TFormColumn): void,
  (e: 'add', value: TFormColumn): void,
  (e: 'remove', value: TFormColumn): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const field = useModelValue(props, emit)

const { fieldBinds, style } = useFormElements()

const columnIcon = computed(() => props.components.find((c) => c.type === 'col').icon)

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

/**
 * Selection
 */

const editor = useAppEditor()

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
  min-height: 40px

.form-column
  position: relative
  margin: 8px 4px
  padding: 8px 4px 4px 4px
  outline: 1px dashed $blue-grey-2
  border-radius: 4px

  &:first-child
    margin-left: 8px

  &:last-child
    margin-right: 8px

  &.selected
    outline: 2px solid $blue-grey-5 !important

  &.hovered
    outline: 1px dashed $blue-grey-4

.action-button
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

<template>
  <div
    class="row form-row"
    :style="{ ...style(field), ...($attrs.style || {}) }"
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
      v-bind="fieldBinds(column, schemaForField(column), ctx)"
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
        style="left: -9px; top: -9px; width: 18px;"
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

      <fields-editor v-model="column._fields" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/App/editor-store'
import { useExpression } from '@/features/Expression/composites'
import { stringValue } from '@/composites/utilities'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { useFormElements } from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: FormField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: FormColumn): void,
  (e: 'add', value: FormColumn): void,
  (e: 'remove', value: FormColumn): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

const {
  fieldBinds,
  style,
  schemaForField,
  componentsByType,
} = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const columnIcon = computed(() => stringValue(componentsByType.col?.icon))

const colName = (column: FormColumn): string => {
  const c = column as AnyData
  if (c.col === undefined || c.col === null || c.col === '') {
    return 'col'
  }
  return `col-${c.col}`
}

/**
 * Selection
 */

const editor = useAppEditor()

const onClick = (column: FormColumn) => {
  emit('click', column)
}

const onRemoveClick = (column: FormColumn) => {
  emit('remove', column)
}
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

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

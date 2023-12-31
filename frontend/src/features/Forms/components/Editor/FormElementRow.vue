<template>
  <div
    :class="{
      row: true,
      'form-row': true,
      [`q-gutter-x-${(field as any).hGutter}`]: true,
      [`q-gutter-y-${(field as any).vGutter}`]: true,
      [`items-${(field as any).items}`]: true,
      [`justify-${(field as any).justify}`]: true,
      ...objectValue(component?.editClasses || {}, field),
      ...classBinds(field),
    }"
    :style="{
      ...objectValue(component?.editStyles || {}, field),
      ...styleBinds(field),
    }"
  >
    <!-- Columns -->

    <div
      v-for="column in field._columns"
      :key="column._id"
      :class="{
        [colName(column)]: true,
        [colBreakName(column)]: true,
        [offsetName(column)]: true,
        'form-column': true,
        selected: editor.isSelected(column._id),
        hovered: editor.isHovered(column._id),
        ...objectValue(componentsByType.col?.editClasses || {}, column),
        ...classBinds(column),
      }"
      :style="{
        ...objectValue(componentsByType.col?.editStyles || {}, column),
        ...styleBinds(column),
        'z-index': 1,
      }"
      v-bind="fieldBinds(column, schemaForField(column), ctx)"
      @mouseover.stop="editor.hover(column._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(column._id)"
      @blur="editor.unhover()"
    >
      <!-- Overlay -->

      <div
        v-if="!editor.isDragging"
        :class="{
          overlay: true,
          ...objectValue(component.overlayClasses || {}, column),
        }"
        :style="{
          ...objectValue(component.overlayStyles || {}, column),
        }"
        @click.stop="onClick(column)"
      />

      <!-- Component icon -->

      <div
        v-if="(!editor.isDragging && editor.isHovered(column._id))
          || editor.isSelected(column._id)"
        class="component-icon bg-grey-9 rounded-borders no-pointer-events"
      >
        <q-icon :name="columnIcon" color="white" size="xs" />
      </div>

      <!-- Remove button -->

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(column._id)"
        class="action-button"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click.stop="onRemoveClick(column)"
      >
        <q-tooltip :delay="500">
          {{ $t('form.controls.remove') }}
        </q-tooltip>
      </q-btn>

      <fields-editor v-model="column._fields" />
    </div>
  </div>

  <!-- Add column button -->

  <q-btn
    v-if="!editor.isDragging && editor.isHovered(field._id)"
    class="action-button add"
    icon="mdi-plus"
    color="blue-4"
    size="xs"
    round
    @click="editor.addColumnToField(component.type, field)"
  >
    <q-tooltip :delay="500">
      {{ $t('form.controls.addColumn') }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/Editor/store'
import { useExpression } from '@/features/Expression/composites'
import { stringValue, objectValue } from '@/composites/utilities'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
// eslint-disable-next-line import/no-cycle
import { useFormElements } from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: FormField
}>()

const emit = defineEmits<{
  (e: 'click', value: FormColumn): void,
  (e: 'add', value: FormColumn): void,
  (e: 'remove', value: FormColumn): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const field = useModelValue(props, emit)

const {
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
  componentsByType,
  colName,
  colBreakName,
  offsetName,
} = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const columnIcon = computed(() => stringValue(componentsByType.col?.icon))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))

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
  right: 0
  width: 24px
  height: 24px
  transform: translate(50%, -50%)
  z-index: 5

  &.add
    right: 26px

.component-icon
  position: absolute
  left: 0
  top: 0
  width: 18px
  height: 22px
  transform: translate(-50%, -50%)

.overlay
  position: absolute
  cursor: pointer
  left: 0
  top: 0
  width: 100%
  height: 100%
</style>

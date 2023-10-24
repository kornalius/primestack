<template>
  <q-card
    class="card"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
    :style="{ ...style(field), ...($attrs.style || {}) }"
  >
    <q-card-section
      v-for="section in sections"
      :key="section._id"
      v-bind="fieldBinds(section, schemaForField(section), ctx)"
      :class="cclass(section)"
      style="z-index: 1;"
      :style="style(section)"
      @mouseover.stop="editor.hover(section._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(section._id)"
      @blur="editor.unhover()"
    >
      <div
        v-if="!editor.isDragging"
        class="overlay"
        @click.stop="onClick(section)"
      />

      <div
        v-if="!editor.isDragging && editor.isHovered(section._id)"
        class="action-button bg-grey-9 rounded-borders no-pointer-events"
        style="left: -9px; top: -9px; width: 18px;"
      >
        <q-icon :name="sectionIcon" color="white" size="xs" />
      </div>

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(section._id)"
        class="action-button"
        style="right: 0;"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(section)"
      >
        <q-tooltip :delay="500">
          Remove
        </q-tooltip>
      </q-btn>

      <fields-editor
        v-model="section._fields"
      />
    </q-card-section>

    <q-card-actions
      v-for="action in actions"
      :key="action._id"
      v-bind="fieldBinds(action, schemaForField(action), ctx)"
      :class="cclass(action, true)"
      style="z-index: 1;"
      :style="style(action)"
      @mouseover.stop="editor.hover(action._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(action._id)"
      @blur="editor.unhover()"
    >
      <div
        v-if="!editor.isDragging"
        class="overlay"
        @click.stop="onClick(action)"
      />

      <div
        v-if="!editor.isDragging && editor.isHovered(action._id)"
        class="action-button bg-grey-9 rounded-borders no-pointer-events"
        style="left: -9px; top: -9px; width: 18px;"
      >
        <q-icon :name="actionIcon" color="white" size="xs" />
      </div>

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(action._id)"
        class="action-button"
        style="right: 26px;"
        icon="mdi-plus"
        color="blue-4"
        size="xs"
        round
        @click="onAddActionClick(action)"
      >
        <q-tooltip :delay="500">
          Add Button
        </q-tooltip>
      </q-btn>

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(action._id)"
        class="action-button"
        style="right: 0;"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(action)"
      >
        <q-tooltip :delay="500">
          Remove
        </q-tooltip>
      </q-btn>

      <fields-editor
        v-model="action._fields"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/App/editor-store'
// eslint-disable-next-line import/no-cycle
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import { useExpression } from '@/features/Expression/composites'
import { stringValue } from '@/composites/utilities'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
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
  (e: 'add-action'): void,
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

const sectionIcon = computed(() => (
  stringValue(componentsByType['card-section']?.icon, field.value)
))

const actionIcon = computed(() => (
  stringValue(componentsByType['card-actions']?.icon, field.value)
))

const sections = computed((): FormColumn[] => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.filter((c) => c._type === 'card-section')
))

const actions = computed((): FormColumn[] => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.filter((c) => c._type === 'card-actions')
))

/**
 * Selection
 */

const editor = useAppEditor()

const cclass = (section: FormColumn, action = false) => ({
  'card-section': !action,
  'card-action': action,
  selected: editor.isSelected(section._id),
  hovered: editor.isHovered(section._id),
})

const onAddActionClick = (cardActions: FormColumn) => {
  const type = 'button'

  const btnComponent = componentsByType[type]

  const btn = {
    _id: hexObjectId(),
    _type: type,
    name: '',
    _columns: [],
    ...Object.keys(btnComponent.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(btnComponent.schema.properties[k]) }
      ), {}),
    ...(defaultValues(btnComponent.defaultValues) || {}),
    label: 'Action',
  }
  // eslint-disable-next-line no-underscore-dangle
  cardActions._fields.push(btn)
}

const onClick = (column: FormColumn) => {
  emit('click', column)
}

const onRemoveClick = (column: FormColumn) => {
  emit('remove', column)
}
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.card
  position: relative
  min-height: 40px

.card-section
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
    outline: 1px dashed $blue-grey-5

.card-action
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
    outline: 1px dashed $blue-grey-5

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

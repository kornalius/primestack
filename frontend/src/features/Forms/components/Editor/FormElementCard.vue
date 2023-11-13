<template>
  <q-card
    :class="{
      card: true,
      ...(component?.editClasses || {}),
      ...classBinds(field),
    }"
    :style="{
      ...(component?.editStyles || {}),
      ...styleBinds(field),
    }"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <q-card-section
      v-for="section in sections"
      :key="section._id"
      :class="cclass(section)"
      :style="{
        'z-index': 1,
        ...(componentsByType['card-section']?.editStyles || {}),
        ...styleBinds(section),
      }"
      v-bind="fieldBinds(section, schemaForField(section), ctx)"
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

      <!-- Component icon -->

      <div
        v-if="(!editor.isDragging && editor.isHovered(section._id))
          || editor.isSelected(section._id)"
        class="component-icon bg-grey-9 rounded-borders no-pointer-events"
      >
        <q-icon :name="sectionIcon" color="white" size="xs" />
      </div>

      <!-- Remove action button -->

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(section._id)"
        class="action-button remove"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(section)"
      >
        <q-tooltip :delay="500">
          {{ $t('form.controls.removeSection') }}
        </q-tooltip>
      </q-btn>

      <fields-editor
        v-model="section._fields"
      />
    </q-card-section>

    <!-- Card Actions -->

    <q-card-actions
      v-for="action in actions"
      :key="action._id"
      :class="cclass(action, true)"
      :style="{
        'z-index': 1,
        ...(componentsByType['card-action']?.editStyles || {}),
        ...styleBinds(action),
      }"
      v-bind="fieldBinds(action, schemaForField(action), ctx)"
      @mouseover.stop="editor.hover(action._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(action._id)"
      @blur="editor.unhover()"
    >
      <!-- Overlay -->

      <div
        v-if="!editor.isDragging"
        class="overlay"
        @click.stop="onClick(action)"
      />

      <!-- Component icon -->

      <div
        v-if="(!editor.isDragging && editor.isHovered(action._id))
          || editor.isSelected(action._id)"
        class="component-icon bg-grey-9 rounded-borders no-pointer-events"
      >
        <q-icon :name="actionIcon" color="white" size="xs" />
      </div>

      <!-- Add action button -->

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(action._id)"
        class="action-button add"
        icon="mdi-plus"
        color="blue-4"
        size="xs"
        round
        @click="onAddActionClick(action)"
      >
        <q-tooltip :delay="500">
          {{ $t('form.controls.addAction') }}
        </q-tooltip>
      </q-btn>

      <!-- Remove action button -->

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(action._id)"
        class="action-button remove"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click="onRemoveClick(action)"
      >
        <q-tooltip :delay="500">
          {{ $t('form.controls.removeSection') }}
        </q-tooltip>
      </q-btn>

      <fields-editor
        v-model="action._fields"
      />
    </q-card-actions>
  </q-card>

  <!-- Add section button -->

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
      {{ $t('form.controls.addSection') }}
    </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { useAppEditor } from '@/features/Editor/store'
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
  classBinds,
  styleBinds,
  schemaForField,
  componentsByType,
  isCardActions,
  isCardSection,
  newNameForField,
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
  field.value._columns.filter((f) => isCardSection(f))
))

const actions = computed((): FormColumn[] => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.filter((f) => isCardActions(f))
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
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
  ...(componentsByType[action ? 'card-action' : 'card-section']?.editClasses || {}),
  ...classBinds(field),
})

const onAddActionClick = (cardActions: FormColumn) => {
  const type = 'button'

  const btnComponent = componentsByType[type]

  const btn = {
    _id: hexObjectId(),
    _type: type,
    _columns: [],
    ...Object.keys(btnComponent.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(btnComponent.schema.properties[k]) }
      ), {}),
    ...(defaultValues(btnComponent.defaultValues) || {}),
    name: newNameForField(type, editor.flattenFormFields()),
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
  padding: 4px 0
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

.component-icon
  position: absolute
  left: 0
  top: 0
  width: 18px
  height: 22px
  transform: translate(-50%, -50%)

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

.overlay
  position: absolute
  cursor: pointer
  left: 0
  top: 0
  width: 100%
  height: 100%
</style>

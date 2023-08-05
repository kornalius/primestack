<template>
  <q-card
    class="card"
    v-bind="fieldBinds(field, schemaForType(field))"
    :style="style(field)"
  >
    <q-card-section
      v-for="section in sections"
      :key="section._id"
      v-bind="fieldBinds(section, schemaForType(section))"
      :class="{
        'card-section': true,
        selected: editor.isSelected(section._id),
        hovered: editor.isHovered(section._id),
      }"
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
        style="left: 0; width: 18px;"
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
        :components="components"
      />
    </q-card-section>

    <q-card-actions
      v-for="action in actions"
      :key="action._id"
      v-bind="fieldBinds(action, schemaForType(action))"
      :class="{
        'card-action': true,
        selected: editor.isSelected(action._id),
        hovered: editor.isHovered(action._id),
      }"
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
        style="left: 0; width: 18px;"
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
        :components="components"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
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
  (e: 'add-action'): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const field = useModelValue(props, emit)

const { fieldBinds, style } = useFormElements()

const sectionIcon = computed(() => (
  props.components.find((c) => c.type === 'card-section').icon
))

const actionIcon = computed(() => (
  props.components.find((c) => c.type === 'card-actions').icon
))

const sections = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.filter((c) => c._type === 'card-section')
))

const actions = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.filter((c) => c._type === 'card-actions')
))

const schemaForType = (f: TFormField | TFormColumn): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)

/**
 * Selection
 */

const editor = useAppEditor()

const onAddActionClick = (cardActions: TFormColumn) => {
  const type = 'button'

  const btnComponent = props.components.find((c) => c.type === type)

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

const onClick = (column: TFormColumn) => {
  emit('click', column)
}

const onRemoveClick = (column: TFormColumn) => {
  emit('remove', column)
}
</script>

<style scoped lang="sass">
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

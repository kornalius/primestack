<template>
  <div
    :class="{
      'form-element': true,
      selected,
      hovered: editor.isHovered(field._id),
    }"
    @mouseover.stop="editor.hover(field._id)"
    @mouseleave="editor.unhover()"
    @focus.stop="editor.hover(field._id)"
    @blur="editor.unhover()"
  >
    <div
      v-if="!editor.isDragging && editor.isHovered(field._id)"
      class="action-button bg-grey-9 rounded-borders no-pointer-events"
      style="left: 0; width: 18px;"
    >
      <q-icon :name="stringValue(component?.icon)" color="white" size="xs" />
    </div>

    <q-btn
      v-if="(isRow(field) || isCard(field)) && !editor.isDragging && editor.isHovered(field._id)"
      class="action-button"
      style="right: 26px;"
      icon="mdi-plus"
      color="blue-4"
      size="xs"
      round
      @click="editor.addColumnToField(components, component.type, field)"
    >
      <q-tooltip :delay="500">
        Add Column or Section
      </q-tooltip>
    </q-btn>

    <q-btn
      v-else-if="interactable && !editor.isDragging && editor.isHovered(field._id)"
      class="action-button"
      style="right: 26px;"
      :icon="activeInteractable ? 'mdi-cursor-pointer' : 'mdi-cursor-move'"
      color="green-4"
      size="xs"
      round
      @click="toggleInteractable"
    >
      <q-tooltip :delay="500">
        {{ activeInteractable ? 'Drag' : 'Edit' }}
      </q-tooltip>
    </q-btn>

    <q-btn
      v-if="!editor.isDragging && editor.isHovered(field._id)"
      class="action-button"
      style="right: 0;"
      icon="mdi-trash-can"
      color="red-4"
      size="xs"
      round
      @click="onRemoveClick"
    >
      <q-tooltip :delay="500">
        Remove
      </q-tooltip>
    </q-btn>

    <div class="element">
      <form-element-row
        v-if="isRow(field)"
        v-model="field"
        :components="components"
        @remove="(col) => editor.removeColumnFromField(col, field)"
        @click="onColumnClick"
      />

      <form-element-card
        v-else-if="isCard(field)"
        v-model="field"
        class="card"
        :components="components"
        @remove="(col) => editor.removeColumnFromField(col, field)"
        @click="onColumnClick"
      />

      <table-editor
        v-else-if="isTable(field)"
        v-model:columns="field.columns"
        v-model:visible-columns="field.visibleColumns"
        :model-value="displayValue"
        v-bind="fieldBinds(field, schemaForType(field), ctx)"
        :query="queryToMongo(field.query, fieldTable, ctx.$expr)"
        :style="style(field)"
      />

      <q-icon
        v-else-if="isIcon(field)"
        :name="displayValue as string"
        v-bind="fieldBinds(field, schemaForType(field), ctx)"
        :style="style(field)"
      />

      <component
        :is="componentForField(field)"
        v-else
        :model-value="displayValue"
        v-bind="fieldBinds(field, schemaForType(field), ctx)"
        :style="style(field)"
      />

      <div
        v-if="!editor.isDragging && !activeInteractable"
        class="overlay"
        :style="{ top: component.type === 'table' ? '48px' : undefined }"
        @click.stop="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/App/editor-store'
import { useQuery } from '@/features/Query/composites'
import { useExpression } from '@/features/Expression/composites'
import { stringValue } from '@/composites/utilities'
import TableEditor from '@/features/Forms/components/Editor/TableEditor.vue'
import { useFormElements } from '../../composites'
import FormElementRow from './FormElementRow.vue'
import FormElementCard from './FormElementCard.vue'

const props = defineProps<{
  modelValue: TFormField
  components: TFormComponent[]
  selected?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: string): void,
  (e: 'remove', value: TFormField): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const {
  componentForField,
  fieldBinds,
  style,
  isRow,
  isCard,
  isIcon,
  isTable,
} = useFormElements()

const { buildCtx, getProp } = useExpression()

const field = useModelValue(props, emit)

const ctx = buildCtx()

const { queryToMongo } = useQuery()

const editor = useAppEditor()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === field.value._type)
))

const fieldTable = computed(() => (
  field.value.tableId
    ? editor.tables.find((t) => t._id === field.value.tableId)
    : undefined
))

const schemaForType = (f: TFormField): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)

const onClick = () => {
  emit('click', props.modelValue._id)
}

const onColumnClick = (column: TFormColumn) => {
  emit('click', column._id)
}

const onRemoveClick = () => {
  emit('remove', props.modelValue)
}

const displayValue = computed(() => (
  getProp(field.value.modelValue, ctx)
))

const interactable = computed(() => component.value.interactable || false)

const activeInteractable = ref(false)

const toggleInteractable = () => {
  activeInteractable.value = !activeInteractable.value
}
</script>

<style scoped lang="sass">
.form-element
  position: relative
  margin: 8px 0
  width: 100%
  border-radius: 4px

  &:first-child
    margin: 0

  &.selected
    outline: 2px solid $blue-grey-5 !important

  &.hovered
    outline: 1px dashed $blue-grey-4

.card
  padding: 4px 0

.action-button
  position: absolute
  top: 0
  z-index: 5

.element
  position: relative
  cursor: default

.overlay
  position: absolute
  cursor: pointer
  left: 0
  top: 0
  right: 0
  bottom: 0

.q-skeleton--anim-wave
  z-index: 0 !important
</style>

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
      class="action bg-grey-9 rounded-borders no-pointer-events"
      style="left: 0; width: 18px;"
    >
      <q-icon :name="fieldIcon" color="white" size="xs" />
    </div>

    <q-btn
      v-if="(isRow || isCard) && !editor.isDragging && editor.isHovered(field._id)"
      class="action"
      style="right: 26px;"
      icon="mdi-plus"
      color="blue-4"
      size="xs"
      round
      @click="onAddColumnClick"
    >
      <q-tooltip :delay="500">
        Add Column or Section
      </q-tooltip>
    </q-btn>

    <q-btn
      v-else-if="interactable && !editor.isDragging && editor.isHovered(field._id)"
      class="action"
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
      class="action"
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
        v-if="isRow"
        v-model="field"
        :components="components"
        @remove="removeColumn"
        @click="onColumnClick"
      />

      <form-element-card
        v-else-if="isCard"
        v-model="field"
        class="card"
        :components="components"
        @remove="removeColumn"
        @click="onColumnClick"
      />

      <table-editor
        v-else-if="field._type === 'table'"
        v-model="field.modelValue"
        v-model:columns="field.columns"
        v-model:visible-columns="field.visibleColumns"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="style"
      />

      <component
        :is="componentForType[field._type]"
        v-else
        v-model="field.modelValue"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="style"
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
import hexObjectId from 'hex-object-id'
import { TSchema } from '@feathersjs/typebox'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import TableEditor from '@/features/Forms/components/Editor/TableEditor.vue'
import useFormElements from '../../composites'
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

const { componentForType, fieldBinds } = useFormElements()

const field = useModelValue(props, emit)

const editor = useAppEditor()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === props.modelValue._type)
))

const fieldIcon = computed(() => component.value?.icon)

const isRow = computed(() => component.value.type === 'row')

const isCard = computed(() => component.value.type === 'card')

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

const onAddColumnClick = () => {
  let type

  if (isRow.value) {
    type = 'col'
  } else if (isCard.value) {
    type = 'card-section'
  }

  const colComponent = props.components.find((c) => c.type === type)

  const col = {
    _id: hexObjectId(),
    _type: type,
    _columns: undefined,
    _fields: [],
    ...Object.keys(colComponent.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(colComponent.schema.properties[k]) }
      ), {}),
    ...(defaultValues(colComponent.defaultValues) || {}),
  }
  // eslint-disable-next-line no-underscore-dangle
  field.value._columns.push(col)
}

const onRemoveClick = () => {
  emit('remove', props.modelValue)
}

const removeColumn = (column: TFormColumn) => {
  // eslint-disable-next-line no-underscore-dangle
  const idx = field.value._columns.findIndex((c) => c._id === column._id)
  if (idx !== -1) {
    // eslint-disable-next-line no-underscore-dangle
    field.value._columns.splice(idx, 1)
  }
}

const style = computed(() => ({
  paddingTop: field.value.padding?.top,
  paddingLeft: field.value.padding?.left,
  paddingBottom: field.value.padding?.bottom,
  paddingRight: field.value.padding?.right,
  marginTop: field.value.margin?.top,
  marginLeft: field.value.margin?.left,
  marginBottom: field.value.margin?.bottom,
  marginRight: field.value.margin?.right,
  ...(component.value.editStyles || {}),
}))

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

.action
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

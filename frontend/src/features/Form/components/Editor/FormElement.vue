<template>
  <div
    :class="{ 'form-element': true, selected }"
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
      v-if="isRow && !editor.isDragging && editor.isHovered(field._id)"
      class="action"
      style="right: 24px;"
      icon="mdi-plus"
      color="blue-4"
      size="xs"
      round
      @click="onAddColumnClick"
    />

    <q-btn
      v-if="!editor.isDragging && editor.isHovered(field._id)"
      class="action"
      style="right: 0;"
      icon="mdi-trash-can"
      color="red-4"
      size="xs"
      round
      @click="onRemoveClick"
    />

    <div class="element">
      <form-element-row
        v-if="isRow"
        v-model="field"
        :components="components"
        :preview="preview"
        :preview-form-data="previewFormData"
        @remove="removeColumn"
        @click="onColumnClick"
      />

      <component
        :is="componentsForFieldType[field._type]"
        v-else
        v-model="field.modelValue"
        v-bind="field"
        :style="{
          paddingTop: field.padding?.top,
          paddingLeft: field.padding?.left,
          paddingBottom: field.padding?.bottom,
          paddingRight: field.padding?.right,
          marginTop: field.margin?.top,
          marginLeft: field.margin?.left,
          marginBottom: field.margin?.bottom,
          marginRight: field.margin?.right,
        }"
        :hint="field.hint === '' ? undefined : field.hint"
      />

      <div
        v-if="!editor.isDragging"
        class="overlay"
        @click.stop="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { TFormField, TFormComponent, TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useFormElements from '@/features/Form/composites'
import FormElementRow from '@/features/Form/components/Editor/FormElementRow.vue'
import useFormEditoreditor from '@/features/Form/store'
import { defaultValueForSchema } from '@/utils/schemas'

const props = defineProps<{
  modelValue: TFormField
  components: TFormComponent[]
  selected?: boolean
  preview: boolean
  previewFormData: Record<string, unknown>
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: string): void,
  (e: 'remove', value: TFormField): void,
  (e: 'update:model-value', value: TFormField): void,
}>()

const { componentsForFieldType } = useFormElements()

const field = useModelValue(props, emit)

const editor = useFormEditoreditor()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === props.modelValue._type)
))

const onClick = () => {
  emit('click', props.modelValue._id)
}

const onColumnClick = (column: TFormColumn) => {
  emit('click', column._id)
}

const onAddColumnClick = () => {
  const col = {
    _id: uuidv4(),
    _type: 'col',
    columns: undefined,
    fields: [],
    ...Object.keys(component.value.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(component.value.schema.properties[k]) }
      ), {}),
    ...(component.value.defaultValues || {}),
  }
  field.value.columns.push(col)
}

const onRemoveClick = () => {
  emit('remove', props.modelValue)
}

const removeColumn = (column: TFormColumn) => {
  const idx = field.value.columns.findIndex((c) => c._id === column._id)
  if (idx !== -1) {
    field.value.columns.splice(idx, 1)
  }
}

const fieldIcon = computed(() => component.value?.icon)

const isRow = computed(() => component.value.type === 'row')
</script>

<style scoped lang="sass">
.form-element
  position: relative
  margin: 8px 0
  width: 100%
  border: 1px dashed $blue-grey-4
  border-radius: 4px

  &:first-child
    margin: 0

  &.selected
    border: 2px solid $blue-grey-5

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
  width: 100%
  height: 100%

</style>

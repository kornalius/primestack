<template>
  <div
    :class="{
      ...objectValue(component?.elementClasses || {}, field),
      'form-element': true,
      selected,
      hovered: isHovered,
    }"
    :style="{
      display: horizontal ? 'inline-block' : undefined,
      width: !horizontal ? '100%' : undefined,
      ...objectValue(component?.elementStyles || {}, field),
    }"
    @mouseover.stop="editor.hover(field._id)"
    @mouseleave="editor.unhover()"
    @focus.stop="editor.hover(field._id)"
    @blur="editor.unhover()"
  >
    <!-- Component Icon -->

    <div
      v-if="(!editor.isDragging && isHovered) || isSelected"
      class="action-button component-icon bg-grey-9 rounded-borders no-pointer-events"
    >
      <q-icon
        :name="stringValue(component?.icon)"
        color="white"
        size="xs"
      />
    </div>

    <!-- Interact button -->

    <q-btn
      v-if="interactable && !editor.isDragging && isHovered"
      class="action-button interactable"
      :icon="activeInteractable ? 'mdi-cursor-pointer' : 'mdi-cursor-move'"
      color="green-4"
      size="xs"
      round
      @click="toggleInteractable"
    >
      <q-tooltip :delay="500">
        {{ activeInteractable ? $t('form.controls.drag') : $t('form.controls.edit') }}
      </q-tooltip>
    </q-btn>

    <!-- Remove button -->

    <q-btn
      v-if="!editor.isDragging && isHovered"
      class="action-button remove"
      icon="mdi-trash-can"
      color="red-4"
      size="xs"
      round
      @click="onRemoveClick"
    >
      <q-tooltip :delay="500">
        {{ $t('form.controls.remove') }}
      </q-tooltip>
    </q-btn>

    <!-- Component -->

    <div
      ref="element"
      class="element"
      :style="{
        display: horizontal ? 'inline-block' : undefined,
        height: '100%',
      }"
    >
      <!-- Row -->

      <form-element-row
        v-if="isRow(field)"
        v-model="field"
        @remove="(col) => editor.removeColumnFromField(col, field)"
        @click="onColumnClick"
      />

      <!-- List -->

      <form-element-list
        v-else-if="isList(field)"
        v-model="field"
        @click="onClick"
      />

      <!-- Toolbar -->

      <form-element-toolbar
        v-else-if="isToolbar(field)"
        v-model="field"
        @click="onClick"
      />

      <!-- Tabs -->

      <form-element-tabs
        v-else-if="isTabs(field)"
        v-model="field"
        @click="onClick"
      />

      <!-- Card -->

      <form-element-card
        v-else-if="isCard(field)"
        v-model="field"
        @remove="(col) => editor.removeColumnFromField(col, field)"
        @click="onColumnClick"
      />

      <!-- Embedded Form -->

      <form-element-embedded-form
        v-else-if="isEmbeddedForm(field)"
        v-model="field"
        @click="onClick"
      />

      <!-- Paragraph -->

      <paragraph
        v-else-if="isParagraph(field)"
        v-model="field[componentsByType[field._type].modelValueField]"
      />

      <!-- Sidebar -->

      <form-element-sidebar
        v-else-if="isSidebar(field)"
        v-model="field"
        @click="onClick"
      />

      <!-- Table -->

      <form-table-editor
        v-else-if="isTable(field)"
        v-model:columns="field.columns"
        v-model:visible-columns="field.visibleColumns"
        :class="{
          ...objectValue(component?.classes || {}, field),
          ...classBinds(field),
        }"
        :style="{
          ...objectValue(component?.styles || {}, field),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
        :model-value="field"
        :add-button="undefined"
      />

      <!-- Icon -->

      <q-icon
        v-else-if="isIcon(field)"
        :name="displayValue as string"
        :class="{
          ...objectValue(component?.classes || {}, field),
          ...classBinds(field),
        }"
        :style="{
          ...objectValue(component?.styles || {}, field),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <!-- Regular component -->

      <component
        :is="componentForField(field)"
        v-else
        :model-value="displayValue"
        :class="{
          ...objectValue(component?.classes || {}, field),
          ...classBinds(field),
        }"
        :style="{
          ...objectValue(component?.styles || {}, field),
          ...styleBinds(field),
        }"
        v-bind="fieldBinds(field, schemaForField(field), ctx)"
      />

      <!-- Overlay -->

      <div
        v-if="!editor.isDragging && !activeInteractable"
        :class="{
          overlay: true,
          ...objectValue(component.overlayClasses || {}, field),
        }"
        :style="{
          ...objectValue(component.overlayStyles || {}, field),
          top: overlayTop,
        }"
        @click.stop="onClick"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { useExpression } from '@/features/Expression/composites'
import { stringValue, objectValue } from '@/composites/utilities'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import FormTableEditor from '@/features/Forms/components/Editor/FormTableEditor.vue'
import Paragraph from '@/features/Fields/components/Editor.vue'
import { useFormElements } from '../../composites'
import FormElementRow from './FormElementRow.vue'
import FormElementCard from './FormElementCard.vue'
import FormElementTabs from './FormElementTabs.vue'
import FormElementEmbeddedForm from './FormElementEmbeddedForm.vue'
import FormElementList from './FormElementList.vue'
import FormElementToolbar from './FormElementToolbar.vue'
import FormElementSidebar from './FormElementSidebar.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: FormField
  selected?: boolean
  horizontal?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', value: string): void,
  (e: 'remove', value: FormField): void,
  (e: 'update:model-value', value: FormField): void,
}>()

const {
  componentsByType,
  componentForField,
  fieldBinds,
  classBinds,
  styleBinds,
  isRow,
  isList,
  isToolbar,
  isTabs,
  isCard,
  isEmbeddedForm,
  isIcon,
  isSidebar,
  isTable,
  isParagraph,
  schemaForField,
} = useFormElements()

const field = useModelValue(props, emit)

const element = ref()

const { t } = useI18n()

const { buildCtx, getProp } = useExpression(t)

const ctx = buildCtx()

const editor = useAppEditor()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))

const onClick = () => {
  emit('click', field.value._id)
}

const onColumnClick = (column: FormColumn) => {
  emit('click', column._id)
}

const onRemoveClick = () => {
  emit('remove', field.value)
}

const modelValueForField = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[component.value.type].modelValueField
))

const displayValue = computed(() => (
  getProp(field.value[modelValueForField.value], ctx)
))

const interactable = computed(() => component.value.interactable || false)

const activeInteractable = ref(false)

const toggleInteractable = () => {
  activeInteractable.value = !activeInteractable.value
}

const isHovered = computed(() => editor.isHovered(field.value._id))

const isSelected = computed(() => editor.isSelected(field.value._id))

const overlayTop = ref('')

watch([() => props.modelValue, component], () => {
  setTimeout(() => {
    overlayTop.value = undefined
    if (isTable(component.value)) {
      const el = element.value?.querySelector('thead')
      const er = element.value?.getBoundingClientRect() || { top: 0 }
      const r = el?.getBoundingClientRect() || { top: 0, height: 0 }
      overlayTop.value = `${r.top - er.top + r.height}px`
    } else if (isTabs(component.value)) {
      const el = element.value?.querySelector('.q-tabs')
      overlayTop.value = `${el?.getBoundingClientRect().height || 0}px`
    }
  }, 250)
}, { immediate: true, deep: true })
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.form-element
  position: relative
  margin: 8px 0
  border-radius: 4px

  &:first-child
    margin: 0

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
  z-index: 1001

  &.interactable
    right: 26px

.component-icon
  position: absolute
  left: 0
  top: 0
  width: 18px
  height: 22px
  transform: translate(-50%, -50%)
  z-index: 1001

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
  min-height: 16px

.q-skeleton--anim-wave
  z-index: 0 !important
</style>

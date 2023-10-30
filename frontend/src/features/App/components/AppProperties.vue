<template>
  <q-drawer
    ref="drawer"
    :model-value="editor.active"
    style="background-color: whitesmoke;"
    :width="400"
    side="right"
  >
    <!-- Title -->

    <section-title
      :title="$t('properties.title')"
      class="text-bold"
      color="blue-grey-4"
    />

    <!-- Action Element properties -->

    <properties-editor
      v-if="showActionElementProperties"
      v-model="selectedActionElement"
      v-model:forced-types="forcedTypes"
      :parents="[form, selectedField, selectedActionElement]"
      :prop-name="''"
      :schema="selectedAction.schema"
      :categories="selectedAction.categories"
      :title="$t('actions.title')"
      icon="mdi-flash"
    />

    <!-- Table Column properties -->

    <properties-editor
      v-else-if="showFormTableColumnProperties"
      v-model="selectedFormTableColumn"
      v-model:forced-types="forcedTypes"
      :parents="[form, selectedField, selectedFormTableColumn]"
      :prop-name="''"
      :schema="selectedFormColumnSchema"
      :categories="selectedFormColumnSchema.categories"
      :disabled-properties="disabledFormTableColumnProperties"
      icon="mdi-table-column"
      show-name
      renameable
    />

    <!-- Form Field properties -->

    <properties-editor
      v-else-if="showFieldProperties"
      v-model="selectedField"
      v-model:forced-types="forcedTypes"
      :parents="[form, selectedField]"
      :prop-name="''"
      :schema="selectedComponent.schema"
      :categories="selectedComponent.categories"
      :icon="selectedComponent.icon as string"
      include-form-data-fields
      show-name
      renameable
    />

    <!-- Table editor properties -->

    <properties-editor
      v-else-if="showTableProperties"
      v-model="selectedTable"
      v-model:forced-types="forcedTypes"
      :parents="[selectedTable]"
      :prop-name="''"
      :schema="selectedTableSchema"
      :categories="selectedTableSchema.categories"
      :disabled-properties="disabledTableProperties"
      icon="mdi-table"
      show-name
      renameable
    />

    <!-- Table editor Field properties -->

    <properties-editor
      v-else-if="showTableFieldProperties"
      v-model="selectedTableField"
      v-model:forced-types="forcedTypes"
      :parents="[selectedTable, selectedTableField]"
      :prop-name="''"
      :schema="selectedSchemaFieldSchema"
      :categories="selectedSchemaFieldSchema.categories"
      :disabled-properties="disabledTableFieldProperties"
      icon="mdi-table"
      show-name
      renameable
    />

    <template v-else-if="!editor.actionId">
      <!-- Menu properties -->

      <properties-editor
        v-if="showMenuProperties"
        v-model="selectedMenu"
        :parents="[selectedMenu]"
        :prop-name="''"
        :schema="selectedMenuSchema"
        :categories="selectedMenuSchema.categories"
        :title="$t('components.menu.label')"
        icon="mdi-menu"
      />

      <!-- Tab properties -->

      <properties-editor
        v-if="showTabProperties"
        v-model="selectedMenu.tabs[selectedTabIndex]"
        :parents="[selectedMenu, selectedMenu.tabs[selectedTabIndex]]"
        :prop-name="''"
        :schema="selectedTabSchema"
        :categories="selectedTabSchema.categories"
        :title="$t('components.tab.label')"
        icon="mdi-tab"
      />

      <!-- Form properties -->

      <properties-editor
        v-if="showFormProperties"
        v-model="form"
        :parents="[form]"
        :prop-name="''"
        :schema="selectedFormSchema"
        :categories="selectedFormSchema.categories"
        icon="mdi-window-maximize"
        show-name
        renameable
      />
    </template>
  </q-drawer>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue'
import { useAppEditor } from '@/features/Editor/store'
import { useFormElements } from '@/features/Forms/composites'
import { useActions } from '@/features/Actions/composites'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema, formTableColumnSchema } from '@/shared/schemas/form'
import { tableSchema, tableFieldSchema } from '@/shared/schemas/table'
import { omitFields } from '@/shared/schema'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

const forcedTypes = ref({})

const editor = useAppEditor()

const { componentsByType } = useFormElements()

const { actionsByType } = useActions()

/**
 * Menus
 */

/**
 * Computes the selected menu instance
 */
const selectedMenu = computed(() => editor.menuInstance(editor.selectedMenu))

/**
 * Computes the selected menu schema
 */
const selectedMenuSchema = computed(() => (
  editor.selectedMenu
    ? menuSchema
    : undefined
))

/**
 * Should we show menu properties?
 */
const showMenuProperties = computed(() => (
  !!selectedMenu.value && !!selectedMenuSchema.value
))

/**
 * Tabs
 */

/**
 * Computes the selected tab index in the selected menu instance
 */
const selectedTabIndex = computed(() => (
  (selectedMenu.value || { tabs: [] }).tabs.findIndex((t) => t._id === editor.selectedTab)
))

/**
 * Computes the selected tab schema
 */
const selectedTabSchema = computed(() => (
  editor.selectedTab
    ? tabSchema
    : undefined
))

/**
 * Should we show the tab properties?
 */
const showTabProperties = computed(() => (
  !!selectedMenu.value && selectedTabIndex.value !== -1 && !!selectedTabSchema.value
))

/**
 * Form
 */

/**
 * Computes the selected form instance
 */
const form = computed(() => editor.formInstance(editor.formId))

/**
 * Computes the selected form field instance
 */
const selectedField = computed(() => editor.formFieldInstance(editor.selected))

/**
 * Computes the selected form's table column instance
 */
const selectedFormTableColumn = computed(() => (
  editor.formTableColumnInstance(editor.selectedFormTableColumn)
))

/**
 * Should we show the form's table column properties?
 */
const showFormTableColumnProperties = computed(() => (
  !!selectedField.value && !!selectedFormTableColumn.value
))

/**
 * Computes the selected form field component
 */
const selectedComponent = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[selectedField.value?._type]
))

/**
 * Should we show the form properties?
 */
const showFormProperties = computed(() => !!form.value)

/**
 * Should we show the form field properties?
 */
const showFieldProperties = computed(() => (
  !!selectedComponent.value && !!selectedField.value
))

/**
 * Computes the selected form schema
 */
const selectedFormSchema = computed(() => (
  formSchema
))

/**
 * Table
 */

/**
 * Computes the selected table instance
 */
const selectedTable = computed(() => editor.tableInstance(editor.selectedTable))

/**
 * Computes the selected table field instance
 */
const selectedTableField = computed(() => (
  editor.tableFieldInstance(editor.selectedTableField)
))

/**
 * Should we show the table properties?
 */
const showTableProperties = computed(() => (
  !!selectedTable.value && !selectedTableField.value
))

/**
 * Should we show the table field properties?
 */
const showTableFieldProperties = computed(() => (
  !!selectedTable.value && !!selectedTableField.value
))

/**
 * Computes the selected table schema
 */
const selectedTableSchema = computed(() => (
  selectedTable.value
    ? omitFields(tableSchema, ['_id', 'fields', 'service'])
    : undefined
))

/**
 * Computes the selected table field schema
 */
const selectedSchemaFieldSchema = computed(() => (
  selectedTableField.value
    ? omitFields(tableFieldSchema, ['_id'])
    : undefined
))

/**
 * Computes the selected table field schema
 */
const selectedFormColumnSchema = computed(() => (
  selectedFormTableColumn.value
    ? omitFields(formTableColumnSchema, ['_id'])
    : undefined
))

/**
 * Computes a list of disabled table property names
 */
const disabledTableProperties = computed((): string[] | undefined => {
  if (selectedTable.value?.service) {
    return Object.keys(selectedTableSchema.value.properties).filter((n) => n !== 'name')
  }
  return undefined
})

/**
 * Computes if table field properties are disabled or not
 */
const disabledTableFieldProperties = computed((): string[] | undefined => {
  if (selectedTable.value?.service) {
    return Object.keys(selectedSchemaFieldSchema.value.properties)
  }
  return undefined
})

/**
 * Computes if form's table column properties are disabled or not
 */
const disabledFormTableColumnProperties = computed((): string[] | undefined => {
  if (selectedTable.value?.service) {
    return Object.keys(selectedSchemaFieldSchema.value.properties)
  }
  return undefined
})

/**
 * Actions
 */

/**
 * Computes the selected action element instance
 */
const selectedActionElement = computed(() => editor.actionElementInstance(editor.selectedActionElement))

/**
 * Computes the selected action element action type
 */
const selectedAction = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  actionsByType[selectedActionElement.value?._type]
))

/**
 * Should we show the action element properties?
 */
const showActionElementProperties = computed(() => (
  !!selectedActionElement.value && !!selectedAction.value
))

/**
 * Drawer scrolling
 */

const drawer = ref()

const scrollTop = ref()

/**
 * Returns the current values being displayed in the properties
 */
const editValues = computed((): unknown[] => {
  if (showActionElementProperties.value) {
    return [selectedActionElement.value]
  }
  if (showFormTableColumnProperties.value) {
    return [selectedFormTableColumn.value]
  }
  if (showFieldProperties.value) {
    return [selectedField.value]
  }
  if (showTableProperties.value) {
    return [selectedTable.value]
  }
  if (showTableFieldProperties.value) {
    return [selectedTableField.value]
  }

  const values = []
  if (showMenuProperties.value) {
    values.push(selectedMenu.value)
  }
  if (showTabProperties.value) {
    values.push(selectedMenu.value.tabs[selectedTabIndex.value])
  }
  if (showFormProperties.value) {
    values.push(form.value)
  }
  return values
})

/**
 * When the displayed values change, update the scroll top position from the store
 */
watch(editValues, () => {
  const ids = editValues.value.map((v) => v._id).join('-')
  scrollTop.value = editor.scrollTop(ids)
}, { immediate: true })

let scrollTimeout: number

/**
 * When scroll happens, update the store
 *
 * @param e
 */
const scroll = (e: MouseEvent) => {
  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    const ids = editValues.value.map((v) => v._id).join('-')
    editor.setScrollTop(ids, (e.target as HTMLElement)?.scrollTop)
  }, 100)
}

/**
 * When the drawer or the scrollTop value changes,
 * set a scroll listener and scroll top position to the scrollTop value
 */
watch([drawer, scrollTop], () => {
  const el = drawer.value?.$el
  const content = el?.querySelector('.q-drawer__content') as HTMLElement
  if (content) {
    content.removeEventListener('scroll', scroll)
    if (scrollTop.value) {
      setTimeout(() => {
        content.scrollTo({ top: scrollTop.value })
      }, 100)
    }
    content.addEventListener('scroll', scroll)
  }
})

/**
 * Before we unmount the component, lets get rid of the scroll event listener
 */
onBeforeUnmount(() => {
  const el = drawer.value?.$el
  const content = el?.querySelector('.q-drawer__content')
  if (content) {
    content.removeEventListener('scroll', scroll)
  }
})
</script>

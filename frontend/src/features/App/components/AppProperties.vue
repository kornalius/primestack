<template>
  <q-drawer
    :model-value="editor.active"
    :width="400"
    side="right"
  >
    <!-- Title -->

    <section-title
      title="Property Editor"
      class="text-bold"
      color="blue-grey-4"
    />

    <!-- Action Element properties -->

    <properties-editor
      v-if="showActionElementProperties"
      v-model="selectedActionElement"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedAction.schema"
      :labels="selectedAction.labels"
      :categories="selectedAction.categories"
    />

    <!-- Form Field properties -->

    <properties-editor
      v-else-if="showFieldProperties"
      v-model="selectedField"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedComponent.schema"
      :labels="selectedComponent.labels"
      :categories="selectedComponent.categories"
    />

    <!-- Table properties -->

    <properties-editor
      v-else-if="showTableProperties"
      v-model="selectedTable"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedTableSchema"
      :categories="selectedTableSchema.categories"
      :labels="selectedTableSchema.labels"
      :disabled-properties="disabledTableProperties"
    />

    <!-- Table Field properties -->

    <properties-editor
      v-else-if="showTableFieldProperties"
      v-model="selectedTableField"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedSchemaFieldSchema"
      :categories="selectedSchemaFieldSchema.categories"
      :labels="selectedSchemaFieldSchema.labels"
      :disabled-properties="disabledTableFieldProperties"
    />

    <template v-else-if="!editor.actionId">
      <!-- Menu title -->

      <section-title
        v-if="showMenuProperties"
        title="Menu"
        icon="mdi-menu"
      />

      <!-- Menu properties -->

      <properties-editor
        v-if="showMenuProperties"
        v-model="selectedMenu"
        :prop-name="''"
        :schema="selectedMenuSchema"
        :categories="selectedMenuSchema.categories"
        :labels="selectedMenuSchema.labels"
      />

      <!-- Tab title -->

      <section-title
        v-if="showTabProperties"
        title="Tab"
        icon="mdi-tab"
      />

      <!-- Tab properties -->

      <properties-editor
        v-if="showTabProperties"
        v-model="selectedMenu.tabs[selectedTabIndex]"
        :prop-name="''"
        :schema="selectedTabSchema"
        :categories="selectedTabSchema.categories"
        :labels="selectedTabSchema.labels"
      />

      <!-- Form title -->

      <section-title
        v-if="showFormProperties"
        title="Form"
        icon="mdi-window-maximize"
      />

      <!-- Form properties -->

      <properties-editor
        v-if="showFormProperties"
        v-model="form"
        :prop-name="''"
        :schema="selectedFormSchema"
        :categories="selectedFormSchema.categories"
        :labels="selectedFormSchema.labels"
      />
    </template>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useAppEditor } from '@/features/App/editor-store'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { TFormComponent } from '@/shared/interfaces/forms'
import { TAction } from '@/shared/interfaces/actions'
import { formSchema } from '@/shared/schemas/form'
import { tableSchema, tableFieldSchema } from '@/shared/schemas/table'
import { omitFields } from '@/shared/schema'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

const props = defineProps<{
  // global components
  components?: TFormComponent[]
  // global actions
  actions?: TAction[]
}>()

const forcedTypes = ref({})

const editor = useAppEditor()

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
  selectedMenu.value && selectedMenuSchema.value
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
  selectedMenu.value && selectedTabIndex.value !== -1 && selectedTabSchema.value
))

/**
 * Form
 */

/**
 * Computes the selected form instance
 */
const form = computed(() => editor.formInstance(editor.formId))

// holds form fields
const fields = ref([])

/**
 * When the form instance changes, set the fields
 */
watch(form, () => {
  if (form.value) {
    // eslint-disable-next-line no-underscore-dangle
    fields.value = form.value._fields
  }
}, { immediate: true })

/**
 * Computes the selected form field instance
 */
const selectedField = computed(() => editor.formFieldInstance(editor.selected))

/**
 * Computes the selected form field component
 */
const selectedComponent = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === selectedField.value?._type)
))

/**
 * Should we show the form properties?
 */
const showFormProperties = computed(() => !!form.value)

/**
 * Should we show the form field properties?
 */
const showFieldProperties = computed(() => (
  props.components && selectedComponent.value && selectedField.value
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
  selectedTable.value && !selectedTableField.value
))

/**
 * Should we show the table field properties?
 */
const showTableFieldProperties = computed(() => (
  selectedTable.value && selectedTableField.value
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
  props.actions.find((a) => a.type === selectedActionElement.value?._type)
))

/**
 * Should we show the action element properties?
 */
const showActionElementProperties = computed(() => (
  selectedActionElement.value && selectedAction.value
))
</script>

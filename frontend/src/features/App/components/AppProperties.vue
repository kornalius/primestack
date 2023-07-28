<template>
  <q-drawer
    :model-value="editor.active"
    :width="400"
    side="right"
  >
    <section-title
      title="Property Editor"
      class="text-bold"
      color="blue-grey-4"
    />

    <properties-editor
      v-if="showFieldProperties"
      v-model="selectedField"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedComponent.schema"
      :categories="selectedComponent.categories"
    />

    <properties-editor
      v-else-if="showSchemaProperties"
      v-model="selectedTable"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedTableSchema"
      :categories="selectedTableSchema.categories"
    />

    <properties-editor
      v-else-if="showSchemaFieldProperties"
      v-model="selectedTableField"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedSchemaFieldSchema"
      :categories="selectedSchemaFieldSchema.categories"
    />

    <template v-else>
      <section-title
        v-if="showMenuProperties"
        title="Menu"
        icon="mdi-menu"
      />

      <properties-editor
        v-if="showMenuProperties"
        v-model="selectedMenuObject"
        :prop-name="''"
        :schema="selectedMenuSchema"
        :categories="selectedMenuSchema.categories"
      />

      <section-title
        v-if="showTabProperties"
        title="Tab"
        icon="mdi-tab"
      />

      <properties-editor
        v-if="showTabProperties"
        v-model="selectedMenuObject.tabs[selectedTabIndex]"
        :prop-name="''"
        :schema="selectedTabSchema"
        :categories="selectedTabSchema.categories"
      />

      <section-title
        v-if="showFormProperties"
        title="Form"
        icon="mdi-window-maximize"
      />

      <properties-editor
        v-if="showFormProperties"
        v-model="form"
        :prop-name="''"
        :schema="filteredFormSchema"
        :categories="filteredFormSchema.categories"
      />
    </template>
  </q-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import useAppEditor from '@/features/App/store'
import useFormElements from '@/features/Forms/composites'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { TFormComponent } from '@/shared/interfaces/forms'
import { formSchema } from '@/shared/schemas/form'
import { tableSchema, tableFieldSchema } from '@/shared/schemas/table'
import { omitFields } from '@/shared/schema'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

const props = defineProps<{
  components?: TFormComponent[]
}>()

const forcedTypes = ref({})

const editor = useAppEditor()

/**
 * Menus
 */

const selectedMenuObject = computed(() => editor.menuInstance(editor.selectedMenu))

const selectedMenuSchema = computed(() => (
  editor.selectedMenu
    ? menuSchema
    : undefined
))

const showMenuProperties = computed(() => (
  selectedMenuObject.value && selectedMenuSchema.value
))

/**
 * Tabs
 */

const selectedTabIndex = computed(() => (
  (selectedMenuObject.value || { tabs: [] }).tabs.findIndex((t) => t._id === editor.selectedTab)
))

const selectedTabSchema = computed(() => (
  editor.selectedTab
    ? tabSchema
    : undefined
))

const showTabProperties = computed(() => (
  selectedMenuObject.value && selectedTabIndex.value !== -1 && selectedTabSchema.value
))

/**
 * Form
 */

const { flattenFields } = useFormElements()

const form = computed(() => editor.formInstance(editor.formId))

const fields = ref([])

watch(form, () => {
  if (form.value) {
    // eslint-disable-next-line no-underscore-dangle
    fields.value = form.value._fields
  }
}, { immediate: true })

const selectedField = computed(() => (
  flattenFields(fields.value).find((f) => f._id === editor.selected)
))

const selectedComponent = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === selectedField.value?._type)
))

const showFormProperties = computed(() => !!form.value)

const showFieldProperties = computed(() => (
  props.components && selectedComponent.value && selectedField.value
))

const filteredFormSchema = computed(() => (
  formSchema
))

/**
 * Schema
 */

const selectedTable = computed(() => editor.tableInstance(editor.selectedTable))

const selectedTableField = computed(() => (
  selectedTable.value?.fields.find((f) => f._id === editor.selectedTableField)
))

const showSchemaProperties = computed(() => (
  editor.selectedTable && !editor.selectedTableField
))

const showSchemaFieldProperties = computed(() => (
  editor.selectedTable && editor.selectedTableField
))

const selectedTableSchema = computed(() => (
  editor.selectedTable
    ? omitFields(tableSchema, ['_id', 'fields', 'indexes'])
    : undefined
))

const selectedSchemaFieldSchema = computed(() => (
  editor.selectedTableField
    ? omitFields(tableFieldSchema, ['_id'])
    : undefined
))
</script>

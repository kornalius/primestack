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
      v-model="selectedSchema"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedSchemaSchema"
      :categories="selectedSchemaSchema.categories"
    />

    <properties-editor
      v-else-if="showSchemaFieldProperties"
      v-model="selectedSchemaField"
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
import { api } from '@/plugins/pinia'
import useAppEditor from '@/features/App/store'
import useFormElements from '@/features/Forms/composites'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { TFormComponent } from '@/shared/interfaces/forms'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import { formSchema } from '@/shared/schemas/form'
import { schemaSchema, fieldSchema } from '@/shared/schemas/schema'
import { omitFields } from '@/shared/schema'

const props = defineProps<{
  components?: TFormComponent[]
}>()

const forcedTypes = ref({})

const editor = useAppEditor()

/**
 * Menus
 */

const { data: menus, find: findMenus } = api.service('menus').useFind({
  query: {},
})
findMenus()

const menu = computed(() => menus.value?.[0])

const selectedMenuObject = computed(() => (
  menu.value?.list.find((m) => m._id === editor.selectedMenu)
))

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

const { data: forms } = api.service('forms').useFind({
  query: {},
})

const userForm = computed(() => forms.value?.[0])

const form = computed(() => userForm.value?.list.find((f) => f._id === editor.formId))

const fields = ref([])

watch(form, () => {
  if (form.value) {
    fields.value = form.value.fields
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

const { data: schemas } = api.service('schemas').useFind({
  query: {},
})

const userSchema = computed(() => schemas.value?.[0])

const selectedSchema = computed(() => (
  userSchema.value?.list.find((s) => s._id === editor.selectedSchema)
))

const selectedSchemaField = computed(() => (
  selectedSchema.value?.fields.find((f) => f._id === editor.selectedSchemaField)
))

const showSchemaProperties = computed(() => (
  editor.selectedSchema && !editor.selectedSchemaField
))

const showSchemaFieldProperties = computed(() => (
  editor.selectedSchema && editor.selectedSchemaField
))

const selectedSchemaSchema = computed(() => (
  editor.selectedSchema
    ? omitFields(schemaSchema, ['_id', 'fields', 'indexes'])
    : undefined
))

const selectedSchemaFieldSchema = computed(() => (
  editor.selectedSchemaField
    ? omitFields(fieldSchema, ['_id'])
    : undefined
))
</script>

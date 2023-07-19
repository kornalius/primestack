<template>
  <q-drawer
    :model-value="editor.active"
    :width="400"
    side="right"
  >
    <properties-editor
      v-if="showFieldProperties"
      v-model="selectedField"
      v-model:forced-types="forcedTypes"
      :prop-name="''"
      :schema="selectedComponent.schema"
    />

    <template v-else>
      <section-title
        v-if="showMenuProperties"
        title="Menu"
      />

      <properties-editor
        v-if="showMenuProperties"
        v-model="selectedMenuObject"
        :prop-name="''"
        :schema="selectedMenuSchema"
      />

      <section-title
        v-if="showTabProperties"
        title="Tab"
      />

      <properties-editor
        v-if="showTabProperties"
        v-model="selectedMenuObject.tabs[selectedTabIndex]"
        :prop-name="''"
        :schema="selectedTabSchema"
      />

      <section-title
        v-if="showFormProperties"
        title="Form"
      />

      <properties-editor
        v-if="showFormProperties"
        v-model="form"
        :prop-name="''"
        :schema="filteredFormSchema"
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
import { omitFields } from '@/composites/schema'

const props = defineProps<{
  components?: TFormComponent[]
}>()

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
    ? omitFields(menuSchema, ['tabs', '_id'])
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
    ? omitFields(tabSchema, ['_id'])
    : undefined
))

const showTabProperties = computed(() => (
  selectedMenuObject.value && selectedTabIndex.value !== -1 && selectedTabSchema.value
))

/**
 * Form
 */

const forcedTypes = ref({})

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
  omitFields(formSchema, ['_id', 'fields'])
))
</script>

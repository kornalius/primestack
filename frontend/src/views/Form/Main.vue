<template>
  <q-page class="q-pa-md">
    <q-layout view="hHh lpr lFr">
      <q-drawer
        v-if="!editor.active && !form?.hideTable"
        :model-value="true"
        class="q-pa-sm q-pr-md"
        :width="400"
        side="left"
        behavior="desktop"
        show-if-above
      >
        <schema-table
          v-model:selected="selected"
          v-bind="tableBinds"
          class="full-height"
          :schema="fieldsToSchema(form?._fields, form?._id)"
          :table-id="form?.tableId"
          :hide-filter="form?.hideFilter"
        />
      </q-drawer>

      <q-page-container>
        <q-page @click="editor.unselectAll()">
          <div v-if="editor.active" class="row">
            <div class="q-mb-sm full-width">
              <div class="row bg-grey-8 items-center q-px-sm">
                <div class="col">
                  <span class="text-h6 text-white">Form</span>
                </div>

                <div class="col-auto">
                  <q-toggle
                    v-model="preview"
                    class="q-ml-sm text-white"
                    label="Preview"
                    left-label
                    dense
                  />

                  <q-toggle
                    v-model="showPreviewFormData"
                    class="q-ml-sm text-white"
                    :disable="!preview"
                    label="Data"
                    left-label
                    dense
                  />
                </div>
              </div>
            </div>
          </div>

          <form-display
            v-if="!editor.active"
            v-model="formData"
            :fields="fields"
            :components="components"
          />

          <form-display
            v-else-if="preview"
            v-model="previewFormData"
            :fields="fields"
            :components="components"
          />

          <form-editor
            v-else
            v-model="fields"
            :components="components"
          />

          <div
            v-if="editor.active && preview && showPreviewFormData"
            class="q-mt-sm"
          >
            <div class="bg-grey-8 q-pl-sm q-mb-sm">
              <div class="row items-center">
                <div class="col">
                  <span class="text-h6 text-white">Data</span>
                </div>
              </div>
            </div>

            <pre>{{ previewFormData }}</pre>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue'
import useFormElements from '@/features/Forms/composites'
import pick from 'lodash/pick'
import useAppEditor from '@/features/App/store'
import { defaultValueForSchema, fieldsToSchema } from '@/shared/schema'
import { useFeathers } from '@/composites/feathers'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import FormEditor from '@/features/Forms/components/Editor/FormEditor.vue'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'
import SchemaTable from '@/features/Fields/components/SchemaTable.vue'
import { formSchema } from '@/shared/schemas/form'

const props = defineProps<{
  menuId: string
  tabId: string
  id?: string
  create?: boolean
}>()

const { api } = useFeathers()

const selected = ref()

const editor = useAppEditor()

const { data: menus } = api.service('menus').useFind({ query: {} })

const userMenu = computed(() => menus.value?.[0])

const menu = computed(() => (
  editor.active
    ? editor.menus?.find((m) => m._id === props.menuId)
    : userMenu.value?.list.find((m) => m._id === props.menuId)
))

const tab = computed(() => (
  menu.value?.tabs.find((t) => t._id === props.tabId)
))

const { data: forms } = api.service('forms').useFind({ query: {} })

const userForm = computed(() => forms.value?.[0])

const form = computed(() => (
  editor.active
    ? editor.forms?.find((f) => f._id === tab.value?.formId)
    : userForm.value?.list.find((f) => f._id === tab.value?.formId)
))

const fields = ref([])

const tableBinds = computed(() => pick(form.value, formSchema.tableFields))

watch(form, () => {
  if (form.value) {
    // eslint-disable-next-line no-underscore-dangle
    fields.value = form.value._fields || []
    editor.setFormId(form.value._id)
  }
}, { immediate: true, deep: true })

const { components, flattenFields } = useFormElements()

const defaultValues = computed(() => (
  flattenFields(fields.value)
    .reduce((acc, f) => {
      // eslint-disable-next-line no-underscore-dangle
      const comp = components.find((c) => c.type === f._type)
      if (comp && !comp.nokey) {
        return { ...acc, [f.name]: defaultValueForSchema(comp.schema.properties.modelValue) }
      }
      return acc
    }, {})
))

const formModelValues = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let convertColumn = (col: TFormColumn): AnyData => ({})

  const convertField = (field: TFormField): AnyData => {
    // eslint-disable-next-line no-underscore-dangle
    if (field._columns) {
      // eslint-disable-next-line no-underscore-dangle
      return field._columns.reduce((acc, col) => ({ ...acc, ...convertColumn(col) }), {})
    }
    return field.modelValue !== undefined ? { [field.name]: field.modelValue } : {}
  }

  convertColumn = (col: TFormColumn): AnyData => (
    // eslint-disable-next-line no-underscore-dangle
    col._fields?.reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
  )

  // eslint-disable-next-line no-underscore-dangle
  return (fields.value || []).reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
})

const formData = computed(() => ({
  ...defaultValues.value,
  ...(form.value?.data || {}),
  ...(formModelValues.value || {}),
}))

const preview = ref(false)
const previewFormData = ref({})
const showPreviewFormData = ref(false)

watch(preview, () => {
  previewFormData.value = {
    ...defaultValues.value,
    ...(form.value?.data || {}),
    ...(formModelValues.value || {}),
  }
})

onBeforeUnmount(() => {
  editor.setFormId(undefined)
})
</script>

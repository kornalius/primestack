<template>
  <q-page class="q-pa-md">
    <q-layout
      v-if="form"
      view="hHh lpr lFr"
    >
      <q-drawer
        v-if="!editor.active && !form.hideTable && table"
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
          :schema="fieldsToSchema(table.fields, `Table-${table._id}`)"
          :table-id="table._id"
          :hide-filter="form.hideFilter"
          selection="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @row-click="toggleSelection"
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

          <q-form
            v-if="!editor.active"
            ref="qform"
            @validation-success="validationSuccess"
            @validation-error="validationError"
          >
            <form-display
              v-model="currentData"
              :fields="fields"
              :components="components"
            />

            <pre>{{ currentData }}</pre>

            <q-card-actions align="right">
              <q-btn
                label="Save"
                type="submit"
                color="positive"
                href="#"
                unelevated
                @click="submit"
              />

              <q-btn
                label="Reset"
                type="reset"
                color="grey-6"
                flat
                @click="resetForm"
              />
            </q-card-actions>
          </q-form>

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
import omit from 'lodash/omit'
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
import cloneDeep from 'lodash/cloneDeep'

const props = defineProps<{
  menuId: string
  tabId: string
  id?: string
  create?: boolean
}>()

const { api } = useFeathers()

const editor = useAppEditor()

/**
 * Menu
 */

const userMenu = api.service('menus').findOneInStore({ query: {} })

const menu = computed(() => (
  editor.active
    ? editor.menuInstance(props.menuId)
    : userMenu.value?.list.find((m) => m._id === props.menuId)
))

const tab = computed(() => (
  menu.value?.tabs.find((t) => t._id === props.tabId)
))

/**
 * Form
 */

const userForm = api.service('forms').findOneInStore({ query: {} })

const form = computed(() => (
  editor.active
    ? editor.formInstance(tab.value?.formId)
    : userForm.value?.list.find((f) => f._id === tab.value?.formId)
))

const fields = ref([])

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
        const v = f.modelValue !== undefined && f.field !== undefined && f.field !== null
          ? { [f.field]: defaultValueForSchema(comp.schema.properties.modelValue) }
          : {}
        return { ...acc, ...v }
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
    return field.modelValue !== undefined && field.field !== undefined && field.field !== null
      ? { [field.field]: field.modelValue }
      : {}
  }

  convertColumn = (col: TFormColumn): AnyData => (
    // eslint-disable-next-line no-underscore-dangle
    col._fields?.reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
  )

  // eslint-disable-next-line no-underscore-dangle
  return (fields.value || []).reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
})

const currentId = ref()
const currentData = ref({})

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

/**
 * Table
 */

const selected = ref([])

const userTable = api.service('tables').findOneInStore({ query: {} })

const table = computed(() => (
  userTable.value?.list.find((t) => t._id === form.value?.tableId)
))

const tableBinds = computed(() => pick(form.value, formSchema.tableFields))

/**
 * Form editing & validations
 */

const qform = ref()

/**
 * Clone document from store or create a new value with the data from the Form
 */
const cloneData = () => {
  if (currentId.value) {
    const r = api.service(table.value._id).getFromStore(currentId.value)
    currentData.value = cloneDeep(r.value)
  } else {
    currentData.value = {
      ...defaultValues.value,
      ...(form.value?.data || {}),
      ...(formModelValues.value || {}),
    }
  }
}

/**
 * when the props.id changes, update currentId
 */
watch(() => props.id, () => {
  currentId.value = props.id
})

/**
 * When selection changes, update the currentId
 */
watch(selected, () => {
  currentId.value = selected.value?.[0]?._id
}, { immediate: true, deep: true })

/**
 * When currentId, form data, defaultValues or formModelValues change, clone the data
 */
watch([currentId, form, defaultValues, formModelValues], () => {
  cloneData()
}, { immediate: true })

const submit = async () => {
  const success = await qform.value.validate()
  if (success) {
    // assume we have a mongo document here
    if (currentData.value._id) {
      api.service(table.value._id).patch(currentData.value._id, omit(currentData.value, ['_id']))
    }
  }
}

const validationSuccess = () => {
}

const validationError = () => {
}

const resetForm = () => {
  cloneData()
}

const toggleSelection = (evt, row) => {
  selected.value = [row]
  cloneData()
}
</script>

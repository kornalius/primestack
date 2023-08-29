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
          v-bind="tableBinds"
          class="full-height"
          :schema="fieldsToSchema(table.fields, `Table-${table._id}`)"
          :table-id="table._id"
          :selected="selected"
          :hide-filter="form.hideFilter"
          add-button="start"
          remove-button="end"
          selection="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @add="addRecord"
          @remove="removeRecord"
          @row-click="toggleSelection"
        />
      </q-drawer>

      <q-page-container>
        <q-page @click="unselectAll">
          <div v-if="editor.active && !editor.actionId" class="row">
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

            <q-card-actions
              v-if="hasChanges"
              align="right"
            >
              <q-btn
                label="Save"
                color="positive"
                outline
                @click="submit"
              />

              <q-btn
                label="Cancel"
                color="negative"
                flat
                @click="resetForm"
              />
            </q-card-actions>

            <q-expansion-item
              v-if="showFilesSection"
              :caption="t('form.files.title', { count: filesCount })"
              icon="mdi-paperclip"
              header-class="q-px-none"
              dense
            >
              <div class="q-my-sm">
                <uploader
                  :label="t('uploader.message')"
                  :query="filesFilter"
                  :accept="mimetypes"
                  :max-file-size="maxFileSize"
                  :max-files="10"
                />
              </div>
            </q-expansion-item>
          </q-form>

          <actions-editor
            v-else-if="editor.actionId"
            v-model="actionList"
            :actions="actions"
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
            :form="form"
            :preview="preview"
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
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import pick from 'lodash/pick'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { useAppEditor } from '@/features/App/store'
import { useFormElements } from '@/features/Forms/composites'
import { useActions } from '@/features/Actions/composites'
import { useExpression } from '@/features/Expression/composites'
import { defaultValueForSchema, fieldsToSchema } from '@/shared/schema'
import { useFeathers } from '@/composites/feathers'
import { formSchema } from '@/shared/schemas/form'
import { useUrl } from '@/composites/url'
import { getId } from '@/composites/utilities'
import { useQuery } from '@/features/Query/composites'
import { useFiles } from '@/features/Files/composites'
import { TFormColumn, TFormField } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import FormEditor from '@/features/Forms/components/Editor/FormEditor.vue'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'
import SchemaTable from '@/features/Fields/components/SchemaTable.vue'
import ActionsEditor from '@/features/Actions/components/Editor/ActionsEditor.vue'
import Uploader from '@/features/Files/components/Uploader.vue'

const props = defineProps<{
  menuId: string
  tabId: string
  id?: string
  create?: boolean
}>()

const { api } = useFeathers()

const editor = useAppEditor()

const router = useRouter()

const quasar = useQuasar()

const { t } = useI18n()

const { queryToMongo } = useQuery()

const { mimetypes, maxFileSize } = useFiles(t)

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
  menu.value?.tabs.find((tt) => tt._id === props.tabId)
))

/**
 * Action
 */

const actionList = computed(() => (
  editor.active
    // eslint-disable-next-line no-underscore-dangle
    ? editor.actionInstance(editor.actionId)?._actions
    : undefined
))

const { actions } = useActions()

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

const {
  components,
  flattenFields,
} = useFormElements()

const { buildCtx, getProp } = useExpression()

const ctx = buildCtx()

const defaultValues = computed(() => (
  flattenFields(fields.value)
    .reduce((acc, f: TFormField) => {
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
    if (field.field !== undefined && field.field !== null) {
      // eslint-disable-next-line no-underscore-dangle
      const comp = components.find((c) => c.type === field._type)
      let v = getProp(field.modelValue, ctx)
      if (comp.numericInput && v !== undefined) {
        v = Number(v)
      }
      if (v !== undefined) {
        return { [field.field]: v }
      }
    }
    return {}
  }

  convertColumn = (col: TFormColumn): AnyData => (
    // eslint-disable-next-line no-underscore-dangle
    col._fields?.reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
  )

  // eslint-disable-next-line no-underscore-dangle
  return (fields.value || []).reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
})

const currentId = ref()
const prevData = ref({})
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
  userTable.value?.list.find((tt) => tt._id === form.value?.tableId)
))

const tableBinds = computed(() => {
  const r = pick(form.value, formSchema.tableFields)
  if (typeof r.query === 'object' && Array.isArray(r.query.groups)) {
    r.query = queryToMongo(r.query, table.value)
  }
  return r
})

/**
 * Form editing & validations
 */

const qform = ref()

/**
 * Get or fetch record
 *
 * @param id ID of the record
 */
const getRecord = async (id: string): Promise<AnyData> => {
  if (table.value) {
    const s = api.service(table.value._id).getFromStore(id, { temps: true })
    if (!s.value) {
      return api.service(table.value._id).get(id)
    }
    return s.value
  }
  return undefined
}

/**
 * Clone document from store or create a new value with the data from the Form
 */
const cloneData = async () => {
  if (currentId.value) {
    if (currentData.value.__isTemp) {
      prevData.value = cloneDeep(currentData.value)
      return
    }

    const r = await getRecord(currentId.value)
    if (r) {
      if (!r.__isTemp) {
        currentData.value = r.clone()
      } else {
        currentData.value = r
      }
      selected.value = [r]
    }
  } else if (!table.value) {
    currentData.value = {
      ...defaultValues.value,
      ...(form.value?.data || {}),
      ...(formModelValues.value || {}),
    }
  } else {
    currentData.value = {}
  }
  prevData.value = cloneDeep(currentData.value)
}

const { menuUrl } = useUrl()

const saveDisabled = ref(false)

/**
 * When a row is selected by clicking on it
 *
 * @param row Selected row value
 */
const toggleSelection = (row: AnyData): void => {
  router.push(menuUrl(props.menuId, props.tabId, getId(row)))
}

/**
 * when the props.id changes, update currentId
 */
watch(() => props.id, () => {
  currentId.value = props.id
}, { immediate: true })

/**
 * When currentId, form data, defaultValues or formModelValues change, clone the data
 */
watch([currentId, form, defaultValues, formModelValues], () => {
  cloneData()
}, { immediate: true })

const refresh = () => {
  currentData.value = {}
  prevData.value = {}
  router.push(menuUrl(props.menuId, props.tabId))
}

/**
 * Submit changes made the currently edited record
 */
const submit = async () => {
  const success = await qform.value.validate()
  if (success) {
    const r = await currentData.value.save()
    prevData.value = cloneDeep(currentData.value)
    toggleSelection(r)
  }
}

/**
 * Resets the current editing record back to its original value
 */
const resetForm = () => {
  quasar.dialog({
    title: t('form.dialog.unsaved.title'),
    persistent: true,
    message: t('form.dialog.unsaved.message'),
    ok: {
      label: t('dialog.ok'),
      color: 'green',
      outline: true,
    },
    cancel: {
      label: t('dialog.cancel'),
      color: 'negative',
      outline: true,
    },
  }).onOk(() => {
    if (currentData.value.__isTemp) {
      currentData.value.remove()
      refresh()
    } else {
      cloneData()
    }
  })
}

const validationSuccess = () => {
  saveDisabled.value = false
}

const validationError = () => {
  saveDisabled.value = true
}

/**
 * Check if the currently edited record has been modified or it's a temp record
 */
const hasChanges = computed(() => (
  currentData.value.__isTemp || !isEqual(prevData.value, currentData.value)
))

/**
 * Add a new temp record in the store
 *
 * @param value
 */
const addRecord = (value?: AnyData) => {
  const r = api.service(table.value._id).new({
    ...defaultValues.value,
    ...(formModelValues.value || {}),
    ...(value || {}),
  })
  r.createInStore()
  toggleSelection(r)
}

/**
 * Confirm removal of record
 *
 * @param value Selected row value from the table
 */
const removeRecord = (value: AnyData) => {
  quasar.dialog({
    title: t('record.dialog.delete.title'),
    persistent: true,
    message: t('record.dialog.delete.message'),
    ok: {
      label: t('dialog.ok'),
      color: 'green',
      outline: true,
    },
    cancel: {
      label: t('dialog.cancel'),
      color: 'negative',
      outline: true,
    },
  }).onOk(async () => {
    const r = await getRecord(getId(value))
    if (r) {
      r.remove()
      refresh()
    }
  })
}

/**
 * when the props.create is true, create a new temp record
 */
watch(() => props.create, () => {
  if (props.create) {
    addRecord()
  }
}, { immediate: true })

/**
 * Watches for route update when there are changes
 */
onBeforeRouteUpdate((): boolean => {
  if (hasChanges.value) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm('Do you really want to navigate away? You have unsaved changes!')
    if (!answer) {
      return false
    }
  }
  return true
})

/**
 * Watches for route leave when there are changes
 */
onBeforeRouteLeave((): boolean => {
  if (hasChanges.value) {
    // eslint-disable-next-line no-alert
    const answer = window.confirm('Do you really want to navigate away? You have unsaved changes!')
    if (!answer) {
      return false
    }
  }
  return true
})

const unselectAll = () => {
  if (editor.active && !preview.value && !editor.actionId) {
    editor.unselectAll()
  }
  if (editor.active && editor.actionId) {
    editor.unselectAll()
    editor.unselectActionElement()
  }
}

/**
 * Files
 */

/**
 * Should we display the files section?
 */
const showFilesSection = computed(() => table.value && currentId.value)

const filesFilter = computed(() => ({
  tableId: table.value?._id,
  docId: currentId.value,
}))

const { data: files, queryWhen } = api.service('files').useFind({
  query: filesFilter,
  temps: true,
})
queryWhen(() => Object.keys(filesFilter.value).length === 2)

const filesCount = computed(() => files.value?.length || 0)
</script>

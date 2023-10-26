<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <div
        v-if="showDrawer"
        class="col-auto q-mr-sm"
      >
        <schema-table
          v-if="!formsViewMode"
          v-bind="tableBinds"
          class="SideTable"
          :schema="fieldsToSchema(table.fields, `Table-${table._id}`)"
          :table-id="table._id"
          :selected="selected"
          :hide-filter="form.hideFilter"
          :pagination="{}"
          add-button="start"
          remove-button="end"
          selection-style="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @add="addRecord"
          @remove="removeRecord"
          @row-click="toggleSelection"
        />

        <ex-table
          v-else
          class="SideTable"
          :selected="selected"
          :schema="formSchemaForDisplay"
          :rows="editor.forms"
          add-button="start"
          remove-button="end"
          selection-style="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @add="addForm"
          @remove="removeForm"
          @row-click="toggleSelection"
        />
      </div>

      <div
        class="col"
        @click="unselectAll"
      >
        <div v-if="editor.active && !editor.actionId && form" class="row">
          <div class="q-mb-sm full-width">
            <div class="row bg-grey-8 items-center q-px-sm">
              <div class="col">
                <span class="text-h6 text-white">
                  {{ form.name }}
                </span>
              </div>

              <div class="col-auto">
                <q-toggle
                  v-model="preview"
                  class="q-ml-sm text-white"
                  :label="$t('editor.preview.title')"
                  left-label
                  dense
                >
                  <q-tooltip :delay="500">
                    {{ $t('editor.preview.tooltip') }}
                  </q-tooltip>
                </q-toggle>

                <q-toggle
                  v-model="showPreviewFormData"
                  class="q-ml-sm text-white"
                  :disable="!editor.preview"
                  :label="$t('editor.data.title')"
                  left-label
                  dense
                >
                  <q-tooltip :delay="500">
                    {{ $t('editor.data.tooltip') }}
                  </q-tooltip>
                </q-toggle>
              </div>
            </div>
          </div>
        </div>

        <q-form
          v-if="!editor.active && form"
          ref="qform"
          @validation-success="validationSuccess"
          @validation-error="validationError"
        >
          <form-display
            v-model="currentData"
            :fields="fields"
            v-bind="formBindings"
          />

          <!-- <pre>{{ currentData }}</pre>-->

          <q-card-actions
            v-if="hasChanges"
            align="right"
          >
            <q-btn
              :label="$t('editor.save.title')"
              color="positive"
              outline
              @click="submit"
            >
              <q-tooltip :delay="500">
                {{ $t('editor.save.tooltip') }}
              </q-tooltip>
            </q-btn>

            <q-btn
              :label="$t('editor.cancel.title')"
              color="negative"
              flat
              @click="resetForm"
            >
              <q-tooltip :delay="500">
                {{ $t('editor.save.tooltip') }}
              </q-tooltip>
            </q-btn>
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
        />

        <form-display
          v-else-if="editor.preview"
          v-model="editor.previewFormData"
          :fields="fields"
        />

        <form-editor
          v-else
          v-model="fields"
          :form="form"
        />

        <div
          v-if="editor.active && editor.preview && editor.showPreviewFormData"
          class="q-mt-sm"
        >
          <div class="bg-grey-8 q-pl-sm q-mb-sm">
            <div class="row items-center">
              <div class="col">
                <span class="text-h6 text-white">Data</span>
              </div>
            </div>
          </div>

          <pre>{{ editor.previewFormData }}</pre>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue'
import { Static, TObject } from '@feathersjs/typebox'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRouter } from 'vue-router'
import pick from 'lodash/pick'
import cloneDeep from 'lodash/cloneDeep'
import isEqual from 'lodash/isEqual'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAppEditor } from '@/features/Editor/store'
import { useApp } from '@/features/App/store'
import { useFormElements } from '@/features/Forms/composites'
import { useExpression } from '@/features/Expression/composites'
import { defaultValueForSchema, fieldsToSchema } from '@/shared/schema'
import { useFeathersService } from '@/composites/feathers'
import { useUrl } from '@/composites/url'
import { columnSchema, fieldSchema, formSchema } from '@/shared/schemas/form'
import { getId } from '@/composites/utilities'
import { useQuery } from '@/features/Query/composites'
import { useFiles } from '@/features/Files/composites'
import { AnyData } from '@/shared/interfaces/commons'
import FormEditor from '@/features/Forms/components/Editor/FormEditor.vue'
import FormDisplay from '@/features/Forms/components/FormDisplay.vue'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'
import ExTable from '@/features/Fields/components/ExTable.vue'
import ActionsEditor from '@/features/Actions/components/Editor/ActionsEditor.vue'
import Uploader from '@/features/Files/components/Uploader.vue'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  menuId?: string
  tabId?: string
  id?: string
  formId?: string
  create?: boolean
}>()

const editor = useAppEditor()

const app = useApp()

const router = useRouter()

const quasar = useQuasar()

const { t } = useI18n()

const { queryToMongo } = useQuery()

const { mimetypes, maxFileSize } = useFiles(t)

const formsViewMode = computed(() => props.menuId === undefined)

/**
 * Menu
 */

const userMenu = useFeathersService('menus')
  .findOneInStore({ query: {} })

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

/**
 * Form
 */

const userForm = useFeathersService('forms')
  .findOneInStore({ query: {} })

const form = computed(() => {
  if (formsViewMode.value) {
    return editor.active
      ? editor.formInstance(props.formId)
      : userForm.value?.list.find((f) => f._id === props.formId)
  }

  return editor.active
    ? editor.formInstance(tab.value?.formId)
    : userForm.value?.list.find((f) => f._id === tab.value?.formId)
})

const fields = ref([])

/**
 * Table
 */

const selected = ref([])

watch(selected, () => {
  app.setSelection(selected.value)
})

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const table = computed(() => (
  userTable.value?.list.find((tt) => tt._id === form.value?.tableId)
))

const {
  flattenFields,
  componentsByType,
  fieldBinds,
  schemaForField,
} = useFormElements()

const currentId = ref()
const prevData = ref({})
const currentData = ref({})

const { buildCtx, getProp } = useExpression(t)

const ctx = buildCtx()

/**
 * Should we show the drawer with a list on the left?
 */
const showDrawer = computed(() => (
  (!editor.active && !form.value?.hideTable && !!table.value && !formsViewMode.value)
    // we are in forms view mode
    || (editor.active && formsViewMode.value)
))

/**
 * Build a JSON schema for the forms list
 */
const formSchemaForDisplay = computed((): TObject => ({
  properties: pick(formSchema.properties, ['name']),
} as TObject))

/**
 * Table (continued)
 */

/**
 * Schema Table binds from form properties
 */
const tableBinds = computed(() => {
  const r = pick(form.value, formSchema.tableFields)
  if (typeof r.query === 'object' && Array.isArray(r.query.groups)) {
    r.query = queryToMongo(r.query, table.value, ctx.$expr)
  }
  return r
})

/**
 * Form (continued)
 */

/**
 * Extract all default values from all the fields in the form
 */
const defaultValues = computed(() => (
  flattenFields(fields.value)
    .reduce((acc, f: FormField) => {
      // eslint-disable-next-line no-underscore-dangle
      const comp = componentsByType[f._type]
      if (comp && !comp.nokey) {
        const af = f as AnyData
        const v = af.modelValue !== undefined && af.field !== undefined && af.field !== null
          ? { [af.field]: defaultValueForSchema(comp.schema.properties.modelValue) }
          : {}
        return { ...acc, ...v }
      }
      return acc
    }, {})
))

/**
 * Extract all fields modelValue
 */
const formModelValues = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let convertColumn = (col: FormColumn): AnyData => ({})

  const convertField = (field: FormField | FormColumn): AnyData => {
    const f = field as AnyData
    // eslint-disable-next-line no-underscore-dangle
    if (f._columns) {
      // eslint-disable-next-line no-underscore-dangle
      return f._columns.reduce((acc, col) => ({ ...acc, ...convertColumn(col) }), {})
    }
    if (f.field !== undefined && f.field !== null) {
      // eslint-disable-next-line no-underscore-dangle
      const comp = componentsByType[f._type]
      let v = getProp(f.modelValue, ctx)
      if (comp.numericInput && v !== undefined) {
        v = Number(v)
      }
      if (v !== undefined) {
        return { [f.field]: v }
      }
    }
    return {}
  }

  convertColumn = (col: FormColumn): AnyData => (
    // eslint-disable-next-line no-underscore-dangle
    col._fields?.reduce((acc, f: FormField) => ({ ...acc, ...convertField(f) }), {})
  )

  // eslint-disable-next-line no-underscore-dangle
  return (fields.value || []).reduce((acc, f) => ({ ...acc, ...convertField(f) }), {})
})

/**
 * Preview
 */

const preview = ref(false)
const showPreviewFormData = ref(false)

watch(preview, () => {
  editor.setPreview(preview.value)
  if (preview.value) {
    editor.setPreviewFormData({
      ...defaultValues.value,
      ...(form.value?.data || {}),
      ...(formModelValues.value || {}),
    })
  } else {
    editor.setPreviewFormData(undefined)
  }
})

watch(showPreviewFormData, () => {
  editor.setShowPreviewFormData(showPreviewFormData.value)
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

onBeforeUnmount(() => {
  editor.setFormsEditor(false)
  editor.setFormId(undefined)
  unselectAll()
})

watch(() => props.menuId, () => {
  if (!props.menuId) {
    editor.unselectMenu()
    editor.setFormsEditor(true)
  } else {
    editor.setFormsEditor(false)
  }
})

/**
 * Form (editing & validations)
 */

const qform = ref()

/**
 * Get or fetch record
 *
 * @param id ID of the record
 */
const getRecord = async (id: string): Promise<AnyData> => {
  if (table.value) {
    const s = useFeathersService(table.value._id).getFromStore(id, { temps: true })
    if (!s.value) {
      return useFeathersService(table.value._id).get(id)
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
      if (selected.value?.[0] !== r) {
        setTimeout(() => {
          selected.value = [r]
        }, 100)
      }
    }
  } else {
    currentData.value = {
      ...defaultValues.value,
      ...(form.value?.data || {}),
    }
  }
  prevData.value = cloneDeep(currentData.value)
}

const { menuUrl, formUrl } = useUrl()

const saveDisabled = ref(false)

/**
 * When a row is selected by clicking on it
 *
 * @param row Selected row value
 */
const toggleSelection = (row: AnyData): void => {
  if (formsViewMode.value) {
    router.push(formUrl(getId(row)))
  } else {
    router.push(menuUrl(props.menuId, props.tabId, getId(row)))
  }
}

/**
 * when the props.id changes, update currentId
 */
watch(() => props.id, () => {
  currentId.value = props.id
}, { immediate: true })

/**
 * When currentId, form data or defaultValues change, clone the data
 */
watch([currentId, form, defaultValues], () => {
  cloneData()
}, { immediate: true })

const refresh = () => {
  currentData.value = {}
  prevData.value = {}
  if (formsViewMode.value) {
    router.push(formUrl(props.formId))
  } else {
    router.push(menuUrl(props.menuId, props.tabId))
  }
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
  const r = useFeathersService(table.value._id).new({
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
      await r.remove()
      refresh()
    }
  })
}

const addForm = () => {
  toggleSelection(editor.addForm())
}

const removeForm = (frm: Form) => {
  quasar.dialog({
    title: t('form.dialog.delete.title'),
    persistent: true,
    message: t('form.dialog.delete.message'),
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
    const i = editor.forms.findIndex((f: Form) => f._id === frm._id)
    if (i !== -1) {
      editor.forms.splice(i, 1)
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

const filesParams = computed(() => ({
  query: filesFilter.value,
  temps: true,
}))

const { data: files, queryWhen } = useFeathersService('files')
  .useFind(filesParams)
queryWhen(() => Object.keys(filesFilter.value).length === 2)

const filesCount = computed(() => files.value?.length || 0)

/**
 * App (store)
 */

watch([
  menu,
  tab,
  form,
  table,
  currentData,
], () => {
  app.setMenu(menu.value?._id)
  app.setTab(tab.value?._id)
  app.setForm(form.value?._id)
  app.setTable(table.value?._id)
  app.setDoc(currentData.value)
}, { immediate: true })

watch(form, () => {
  if (form.value) {
    // eslint-disable-next-line no-underscore-dangle
    fields.value = form.value._fields || []
    editor.setFormId(form.value._id)
  }
}, { immediate: true, deep: true })

const formBindings = computed(() => form.value && fieldBinds(
  form.value,
  schemaForField(form.value),
  ctx,
  ['mounted', 'update', 'unmounted', 'keydown', 'keyup'],
))
</script>

<style scoped lang="sass">
:deep(.SideTable)
  width: 500px
  height: calc(100vh - 78px)
</style>

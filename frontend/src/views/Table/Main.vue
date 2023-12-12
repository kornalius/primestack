<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <div class="col">
        <ex-table
          v-model:selected="selectedTables"
          style="height: 300px"
          :rows="editor.tables"
          :columns="schemaColumns"
          :rows-per-page-options="[0]"
          :add-function="addTable"
          :add-options="addOptions"
          :remove-function="removeTable"
          add-button="start"
          title="Tables"
          row-key="_id"
          hide-filter
          remove-button
          virtual-scroll
          bordered
          dense
          flat
          @row-click="toggleTableSelection"
          @add-option="addSpecialTable"
        />
      </div>
    </div>

    <div class="row q-mt-sm">
      <div v-if="selectedTable" class="col">
        <table-editor
          v-model:fields="selectedTable.fields"
          :model-value="selectedTable"
          style="height: 600px"
          :title="`${$t('table.title')} - ${selectedTable?.name}`"
          :rows-per-page-options="[0]"
          :add-function="addTableField"
          :remove-function="removeTableField"
          :add-disable="tableHasService"
          :can-remove="() => !tableHasService"
          selection-style="none"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @add-field="addTableField"
          @remove-field="removeTableField"
          @select-field="toggleTableFieldSelection"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
} from 'vue'
import hexObjectId from 'hex-object-id'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { Static } from '@feathersjs/typebox'
import { useAppEditor } from '@/features/Editor/store'
import { useUrl } from '@/composites/url'
import { useAuth } from '@/features/Auth/store'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { eventTable } from '@/shared/schemas/event'
import { fileTable } from '@/shared/schemas/file'
import { AddOption, ExTableColumn } from '@/features/Fields/interfaces'
import { isServiceAvailable } from '@/shared/plan'
import { useI18n } from 'vue-i18n'
import ExTable from '@/features/Fields/components/ExTable.vue'
import TableEditor from '@/features/Tables/components/Editor/TableEditor.vue'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  id?: string
  fieldId?: string
  create?: boolean
}>()

const quasar = useQuasar()

const { t } = useI18n()

const editor = useAppEditor()

const { tableUrl } = useUrl()

const router = useRouter()

const auth = useAuth()

onMounted(() => {
  editor.unselectAll()
  editor.setTablesEditor(true)
})

onBeforeUnmount(() => {
  editor.unselectAll()
  editor.setTableId(undefined)
  editor.setTablesEditor(false)
})

const selectedTables = ref([])

const selectedTable = computed(() => (
  editor.tableInstance(selectedTables.value?.[0]?._id)
))

const selectedTableFields = ref([])

const selectedTableField = computed(() => {
  const id = selectedTableFields.value?.[0]?._id
  if (selectedTable.value) {
    return selectedTable.value.fields.find((f) => f._id === id)
  }
  return undefined
})

const toggleTableSelection = (row) => {
  selectedTableFields.value = []
  selectedTables.value = [row]
}

const toggleTableFieldSelection = (field) => {
  selectedTableFields.value = [field]
}

const tableHasService = computed((): boolean => (
  !!editor.tableInstance(selectedTable.value?._id)?.service
))

const addOptions = computed((): AddOption[] => ([
  {
    label: 'Files',
    value: 'files',
    icon: 'mdi-file-multiple',
    // eslint-disable-next-line no-underscore-dangle
    disabled: !isServiceAvailable('files', auth.user._plan.code),
    // eslint-disable-next-line no-underscore-dangle
    paid: isServiceAvailable('files', auth.user._plan.code),
  },
  {
    label: 'Events',
    value: 'events',
    icon: 'mdi-calendar-multiple',
    // eslint-disable-next-line no-underscore-dangle
    disabled: !isServiceAvailable('events', auth.user._plan.code),
    // eslint-disable-next-line no-underscore-dangle
    paid: isServiceAvailable('events', auth.user._plan.code),
  },
]))

watch(() => props.id, () => {
  if (props.id) {
    selectedTables.value = [editor.tableInstance(props.id)]
  }
}, { immediate: true })

watch(() => props.fieldId, () => {
  if (props.fieldId) {
    selectedTableFields.value = [editor.tableFieldInstance(props.fieldId)]
  }
}, { immediate: true })

watch([selectedTable, selectedTableField], () => {
  editor.setTableId(selectedTable.value?._id)
  editor.select(selectedTableField.value?._id)
  router.push(tableUrl(selectedTable.value?._id, selectedTableField.value?._id))
})

const addTable = () => {
  const table = editor.addTable(undefined, true)
  selectedTables.value = [table]
  return table
}

const addSpecialTable = (type: string) => {
  const tables = {
    files: fileTable,
    events: eventTable,
  }

  const table = addTable()

  Object.keys(tables[type]).forEach((k: string) => {
    table[k] = tables[type][k]
  })

  table.fields.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f._id = f._id || hexObjectId()
  })
}

const removeTable = (table: Table): void => {
  quasar.dialog({
    title: t('table.dialog.delete.title'),
    persistent: true,
    message: t('table.dialog.delete.message'),
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
    if (editor.removeTable(table._id)) {
      editor.setTableId(undefined)
      selectedTableFields.value = []
      selectedTables.value = []
    }
  })
}

const addTableField = () => {
  if (selectedTable.value) {
    const field = editor.addFieldToTable(selectedTable.value)
    selectedTableFields.value = [field]
  }
}

const removeTableField = (f: TableField): void => {
  quasar.dialog({
    title: t('field.dialog.delete.title'),
    persistent: true,
    message: t('field.dialog.delete.message'),
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
    if (editor.removeFieldFromTable(f._id, selectedTable.value)) {
      editor.unselectAll()
      selectedTableFields.value = []
    }
  })
}

watch(() => props.create, () => {
  if (props.create) {
    if (props.id) {
      selectedTables.value = [editor.tableInstance(props.id)]
      addTableField()
    } else {
      addTable()
    }
  }
}, { immediate: true })

const schemaColumns = ref([
  {
    name: 'name',
    label: 'Name',
    required: true,
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'methods',
    label: 'Methods',
    align: 'left',
    field: 'methods',
  },
  {
    name: 'fields',
    label: '#Fields',
    align: 'left',
    field: 'fields',
    format: (val, row) => (!row ? val : val?.length),
  },
] as ExTableColumn[])
</script>

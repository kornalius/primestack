<template>
  <q-page class="q-pa-sm">
    <div class="row">
      <div class="col">
        <ex-table
          v-model:selected="selectedTable"
          style="height: 300px"
          :rows="editor.tables"
          :columns="schemaColumns"
          :rows-per-page-options="[0]"
          :add-function="addTable"
          :add-options="addOptions"
          :remove-function="removeTable"
          add-button="start"
          remove-button="end"
          title="Tables"
          selection-style="single"
          row-key="_id"
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
      <div v-if="selectedTable.length > 0" class="col">
        <ex-table
          v-model:selected="selectedTableField"
          style="height: 600px"
          :rows="tableFields"
          :columns="fieldColumns"
          :rows-per-page-options="[0]"
          :add-function="addTableField"
          :remove-function="removeTableField"
          :add-disable="tableHasService"
          :can-remove="() => !tableHasService"
          add-button="start"
          remove-button="end"
          title="Fields"
          selection-style="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @row-click="toggleTableFieldSelection"
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
import { AddOption } from '@/features/Fields/interfaces'
import { isServiceAvailable } from '@/shared/plan'
import { useI18n } from 'vue-i18n'
import ExTable from '@/features/Fields/components/ExTable.vue'

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
  editor.unselectMenu()
})

onBeforeUnmount(() => {
  editor.unselectAll()
  editor.unselectTableField()
  editor.unselectTable()
})

const selectedTable = ref([])

const selectedTableField = ref([])

const toggleTableSelection = (row) => {
  selectedTableField.value = []
  selectedTable.value = [row]
}

const toggleTableFieldSelection = (row) => {
  selectedTableField.value = [row]
}

const tableFields = computed(() => (
  editor.tableInstance(selectedTable.value?.[0]?._id)?.fields || []
))

const tableHasService = computed((): boolean => (
  !!editor.tableInstance(selectedTable.value?.[0]?._id)?.service
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
    selectedTable.value = [editor.tableInstance(props.id)]
  }
}, { immediate: true })

watch(() => props.fieldId, () => {
  if (props.fieldId) {
    selectedTableField.value = [editor.tableFieldInstance(props.fieldId)]
  }
}, { immediate: true })

watch(selectedTable, () => {
  if (selectedTable.value?.[0]?._id) {
    editor.unselectTableField()
    editor.selectTable(selectedTable.value?.[0]?._id)
    router.push(tableUrl(selectedTable.value?.[0]?._id))
  }
})

watch(selectedTableField, () => {
  if (selectedTable.value?.[0]?._id && selectedTableField.value?.[0]?._id) {
    editor.selectTableField(selectedTableField.value?.[0]?._id)
    router.push(tableUrl(selectedTable.value?.[0]?._id, selectedTableField.value?.[0]?._id))
  }
})

const addTable = () => {
  const ta = editor.addTable(true)
  selectedTable.value = [ta]
  return ta
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
      editor.unselectTable()
      selectedTable.value = []
    }
  })
}

const addTableField = () => {
  const field = editor.addFieldToTable(selectedTable.value?.[0]?._id)
  selectedTableField.value = [field]
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
    if (editor.removeFieldFromTable(f._id, selectedTable.value?.[0])) {
      editor.unselectTableField()
      selectedTableField.value = []
    }
  })
}

watch(() => props.create, () => {
  if (props.create) {
    if (props.id) {
      selectedTable.value = [editor.tableInstance(props.id)]
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
])

const fieldColumns = ref([
  {
    name: 'name',
    label: 'Name',
    required: true,
    align: 'left',
    field: 'name',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    align: 'left',
  },
  {
    name: 'optional',
    label: 'Optional',
    align: 'center',
    field: 'optional',
    format: (val) => (val ? '\u2714' : ''),
  },
  {
    name: 'hidden',
    label: 'Hidden',
    align: 'center',
    field: 'hidden',
    format: (val) => (val ? '\u2714' : ''),
  },
  {
    name: 'array',
    label: 'Array',
    align: 'center',
    field: 'array',
    format: (val) => (val ? '\u2714' : ''),
  },
  {
    name: 'queryable',
    label: 'Queryable',
    align: 'center',
    field: 'queryable',
    format: (val) => (val ? '\u2714' : ''),
  },
])
</script>

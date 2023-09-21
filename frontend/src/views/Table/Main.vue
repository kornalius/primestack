<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <schema-table
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
        <schema-table
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
import { Static } from '@feathersjs/typebox'
import { useAppEditor } from '@/features/App/editor-store'
import { useUrl } from '@/composites/url'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import SchemaTable from '@/features/Tables/components/SchemaTable.vue'
import { eventTable } from '@/shared/schemas/event'
import { fileTable } from '@/shared/schemas/file'
import { AddOption } from '@/features/Fields/interfaces'
import { isServiceAvailable } from '@/shared/plan'
import { useAuth } from '@/features/Auth/store'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  id?: string
  fieldId?: string
  create?: boolean
}>()

const editor = useAppEditor()

const { tableUrl } = useUrl()

const router = useRouter()

const auth = useAuth()

onMounted(() => {
  editor.unselectAll()
})

onBeforeUnmount(() => {
  editor.unselectAll()
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
  const t = editor.addTable(true)
  selectedTable.value = [t]
  return t
}

const addSpecialTable = (type: string) => {
  const tables = {
    files: fileTable,
    events: eventTable,
  }

  const t = addTable()

  Object.keys(tables[type]).forEach((k: string) => {
    t[k] = tables[type][k]
  })

  t.fields.forEach((f) => {
    // eslint-disable-next-line no-param-reassign
    f._id = f._id || hexObjectId()
  })
}

const removeTable = (t: Table): void => {
  if (editor.removeTable(t._id)) {
    editor.unselectTable()
    selectedTable.value = []
  }
}

const addTableField = () => {
  const field = editor.addFieldToTable(selectedTable.value?.[0]?._id)
  selectedTableField.value = [field]
}

const removeTableField = (f: TableField): void => {
  if (editor.removeFieldFromTable(f._id, selectedTable.value?.[0])) {
    editor.unselectTableField()
    selectedTableField.value = []
  }
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
    format: (val) => val.join(', '),
  },
  {
    name: 'fields',
    label: '#Fields',
    align: 'left',
    field: 'fields',
    format: (val) => val.length,
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

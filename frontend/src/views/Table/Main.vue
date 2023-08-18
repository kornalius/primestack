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
          :remove-function="removeTable"
          add-button="start"
          remove-button="end"
          title="Tables"
          selection="single"
          row-key="_id"
          virtual-scroll
          bordered
          dense
          flat
          @row-click="toggleTableSelection"
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
          add-button="start"
          remove-button="end"
          title="Fields"
          selection="single"
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
import { useRouter } from 'vue-router'
import { Static } from '@feathersjs/typebox'
import { useAppEditor } from '@/features/App/store'
import { useUrl } from '@/composites/url'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import SchemaTable from '@/features/Fields/components/SchemaTable.vue'

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

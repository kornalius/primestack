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
          title="Tables"
          selection="single"
          row-key="_id"
          add-button="start"
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
import useAppEditor from '@/features/App/store'
import { useUrl } from '@/composites/url'
import SchemaTable from '@/features/Fields/components/SchemaTable.vue'

const props = defineProps<{
  id?: string
  fieldId?: string
  create?: boolean
}>()

const editor = useAppEditor()

const { tableUrl } = useUrl()

const router = useRouter()

onMounted(() => {
  editor.unselectTab()
  editor.unselectMenu()
})

onBeforeUnmount(() => {
  editor.unselectTableField()
  editor.unselectTable()
})

const selectedTable = ref([])

const selectedTableField = ref([])

watch(() => props.id, () => {
  if (props.id) {
    selectedTable.value = [editor.tableInstance(props.id)]
  }
}, { immediate: true })

watch(selectedTable, () => {
  editor.selectTable(selectedTable.value?.[0]?._id)
  router.push(tableUrl(selectedTable.value?.[0]?._id))
})

const tableFields = computed(() => (
  selectedTable.value?.[0]?.fields || []
))

watch(() => props.fieldId, () => {
  if (tableFields.value && props.fieldId) {
    const field = tableFields.value.find((f) => f._id === props.fieldId)
    if (field) {
      selectedTableField.value = [field]
    }
  }
}, { immediate: true })

watch(selectedTableField, () => {
  editor.selectTableField(selectedTableField.value?.[0]?._id)
  router.push(tableUrl(selectedTable.value?.[0]?._id, selectedTableField.value?.[0]?._id))
})

watch(() => props.create, () => {
  if (props.create) {
    if (props.id) {
      // create a new field in table
      const table = editor.tableInstance(props.id)
      selectedTable.value = [table]
      const field = editor.addFieldToTable(table)
      selectedTableField.value = [field]
      return
    }

    // create a new table
    const table = editor.addTable()
    selectedTable.value = [table]
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

const toggleTableSelection = (row) => {
  selectedTableField.value = []
  selectedTable.value = [row]
}

const toggleTableFieldSelection = (row) => {
  selectedTableField.value = [row]
}

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

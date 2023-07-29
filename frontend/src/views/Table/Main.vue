<template>
  <q-page class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-table
          v-model:selected="selectedTable"
          style="height: 300px"
          :rows="editor.tables"
          :columns="schemaColumns as any"
          :rows-per-page-options="[0]"
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
        <q-table
          v-model:selected="selectedTableField"
          style="height: 600px"
          :rows="tableFields"
          :columns="fieldColumns as any"
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
import useAppEditor from '@/features/App/store'

const props = defineProps<{
  id?: string
  create?: boolean
}>()

const editor = useAppEditor()

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
})

watch(selectedTableField, () => {
  editor.selectTableField(selectedTableField.value?.[0]?._id)
})

const tableFields = computed(() => (
  selectedTable.value?.[0]?.fields || []
))

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

const toggleTableSelection = (evt, row) => {
  selectedTableField.value = []
  selectedTable.value = [row]
}

const toggleTableFieldSelection = (evt, row) => {
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

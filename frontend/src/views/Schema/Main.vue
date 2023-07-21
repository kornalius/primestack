<template>
  <div class="row">
    <div class="col">
      <q-table
        v-model:selected="selectedSchema"
        style="height: 600px"
        :rows="userSchemas"
        :columns="schemaColumns as any"
        :rows-per-page-options="[0]"
        title="Schemas"
        selection="single"
        row-key="_id"
        virtual-scroll
        bordered
        dense
        flat
        @row-click="toggleSchemaSelection"
      />
    </div>

    <div v-if="selectedSchema.length > 0" class="col">
      <q-table
        v-model:selected="selectedSchemaField"
        style="height: 600px"
        :rows="schemaFields"
        :columns="fieldColumns as any"
        :rows-per-page-options="[0]"
        title="Fields"
        selection="single"
        row-key="_id"
        virtual-scroll
        bordered
        dense
        flat
        @row-click="toggleSchemaFieldSelection"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, onMounted, ref, watch,
} from 'vue'
import { api } from '@/plugins/pinia'
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
  editor.unselectSchemaField()
  editor.unselectSchema()
})

const { data: schemas } = api.service('schemas').useFind({
  query: {},
})

const userSchemas = computed(() => schemas.value?.[0]?.list)

const selectedSchema = ref([])

const selectedSchemaField = ref([])

watch(() => props.id, () => {
  if (props.id) {
    selectedSchema.value = [userSchemas.value?.find((s) => s._id === props.id)]
  }
}, { immediate: true })

watch(selectedSchema, () => {
  editor.selectSchema(selectedSchema.value?.[0]?._id)
})

watch(selectedSchemaField, () => {
  editor.selectSchemaField(selectedSchemaField.value?.[0]?._id)
})

const schemaFields = computed(() => (
  selectedSchema.value?.[0]?.fields || []
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

const toggleSchemaSelection = (evt, row) => {
  selectedSchemaField.value = []
  selectedSchema.value = [row]
}

const toggleSchemaFieldSelection = (evt, row) => {
  selectedSchemaField.value = [row]
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

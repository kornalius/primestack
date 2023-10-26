<template>
  <div v-bind="$attrs">
    <div
      v-if="!hideTableSelect"
      class="row q-ma-sm"
    >
      <div class="col">
        <table-select
          v-model="currentSchemaId"
          :label="$t('query.select_table')"
          options-dense
          dense
          outlined
        />
      </div>
    </div>

    <div
      v-if="showLimits"
      class="row q-gutter-sm"
    >
      <div class="col-3">
        <q-input
          v-model="query.limit"
          :label="$t('query.limit')"
          type="number"
          dense
          outlined
        />
      </div>

      <div class="col-3">
        <q-input
          v-model="query.skip"
          :label="$t('query.skip')"
          type="number"
          dense
          outlined
        />
      </div>
    </div>

    <array-editor
      v-model="query.groups"
      add-button="end"
      :disable="disable || !currentSchemaId"
      :add-function="addGroup"
      :remove-function="removeGroup"
      no-separator
    >
      <template #default="{ index }">
        <div class="row">
          <div class="col">
            <query-group-editor
              v-model="query.groups[index]"
              :label="`${$t('query.group')} ${index + 1}`"
              :disable="disable || !currentSchemaId"
              :color="palette[index % palette.length]"
              :fields="fields"
              :operators="queryOperators"
            />
          </div>
        </div>

        <div class="row">
          <div class="col q-ml-sm">
            <query-logical-operators
              v-if="index < query.groups.length - 1"
              v-model="query.groups[index].logicOp"
              :disable="disable || !currentSchemaId"
              color="negative"
            />
          </div>
        </div>
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { Query, QueryGroup, queryOperators } from '@/shared/interfaces/query'
import { useAppEditor } from '@/features/Editor/store'
import { useTable } from '@/features/Tables/composites'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryGroupEditor from '@/features/Query/components/Editor/QueryGroup.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'
import TableSelect from '@/features/Tables/components/TableSelect.vue'

const props = defineProps<{
  modelValue: Query | undefined
  // override the query tableId
  tableId?: string
  disable?: boolean
  // hide the table selector
  hideTableSelect?: boolean
  // show limit and skip inputs
  showLimits?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:tableId', value: string): void,
  (e: 'update:model-value', value: Query): void,
}>()

const editor = useAppEditor()

const { tableFields } = useTable()

const palette = ref([
  'bg-purple-1',
  'bg-green-1',
  'bg-blue-1',
  'bg-grey-1',
  'bg-orange-1',
  'bg-teal-1',
  'bg-pink-1',
])

const query = useModelValue(props, emit)

const currentSchemaId = useSyncedProp(props, 'tableId', emit)

const addGroup = () => {
  const group: QueryGroup = {
    criterias: [],
    logicOp: 'and',
  }
  query.value.groups.push(group)
}

const removeGroup = (val: unknown, index: number): boolean => {
  query.value.groups.splice(index, 1)
  return true
}

watch(() => props.tableId, () => {
  if (props.tableId) {
    query.value.tableId = props.tableId
  }
}, { immediate: true })

watch(currentSchemaId, () => {
  query.value.tableId = currentSchemaId.value
})

watch(query, () => {
  if (!Array.isArray(query.value.groups)) {
    query.value.groups = []
  }
  if (query.value.groups.length === 0) {
    addGroup()
  }
}, { immediate: true })

/**
 * Schemas
 */

const table = computed(() => (
  editor.tables?.find((s) => s._id === query.value?.tableId)
))

const fields = computed(() => (
  tableFields(
    table.value?.fields || [],
    table.value?.created,
    table.value?.updated,
    table.value?.softDelete,
  )
))

watch(() => query.value.tableId, () => {
  query.value.groups = []
  addGroup()
})
</script>

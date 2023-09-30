<template>
  <ex-table
    v-model:selected="currentSelected"
    v-model:filter="currentFilter"
    v-bind="$attrs"
    :rows="filteredRows"
    :schema="schema"
    :hide-filter="hideFilter"
    :schema-rows="schemaRows"
    :disable="disable"
    :add-button="addButton"
    :add-function="addFunction"
    :add-icon="addIcon"
    :add-label="addLabel"
    :add-options="addOptions"
    :add-disable="addDisable"
    :remove-button="removeButton"
    :remove-icon="removeIcon"
    :can-remove="canRemove"
    :remove-label="removeLabel"
    :remove-function="removeFunction"
    :remove-disable="removeDisable"
    :selection-style="selectionStyle"
    custom-filter
    @add="(value) => $emit('add', value)"
    @add-option="(value) => $emit('add-option', value)"
    @row-click="(value) => $emit('row-click', value)"
    @remove="(value) => $emit('remove', value)"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </ex-table>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import omit from 'lodash/omit'
import sift from 'sift'
import { TSchema } from '@feathersjs/typebox'
import { useSyncedProp } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathers } from '@/composites/feathers'
import { useQuery } from '@/features/Query/composites'
import { useTable } from '@/features/Tables/composites'
import { filterToMongo } from '@/composites/filter'
import ExTable from '@/features/Fields/components/ExTable.vue'
import { AddOption } from '@/features/Fields/interfaces'

const props = defineProps<{
  // rows to display in table
  rows?: unknown[]
  // schema to generate columns with
  schema?: TSchema
  // 2-ways binding for selected rows
  selected?: unknown[]
  // 2-ways binding for filter string
  filter?: string
  // should we hide the filter
  hideFilter?: boolean
  // Renders the rows using schema inputs
  schemaRows?: boolean
  // are table's interactions disabled?
  disable?: boolean
  // position of the add button
  addButton?: 'start' | 'end'
  // function to execute to add a new item to the array, return the value if successful
  addFunction?: () => unknown | undefined
  // icon for the add button
  addIcon?: string
  // label for the add button
  addLabel?: string
  // add button's menu options
  addOptions?: AddOption[]
  // should we disable the add feature?
  addDisable?: boolean
  // position of the remove button on the rows
  removeButton?: 'end'
  // icon for the remove button
  removeIcon?: string
  // function called before removing item at index
  canRemove?: (value: unknown) => boolean
  // label for the remove button
  removeLabel?: string
  // function to execute to remove an item from the table
  removeFunction?: (value: unknown) => void
  // should we disable the remove row feature
  removeDisable?: boolean
  // type of selection allowed
  selectionStyle?: 'single' | 'multiple' | 'none'
  // custom mongo query to apply on top of filter
  query?: AnyData
  // table id to use for rows
  tableId?: string
  // show temps records from store
  temps?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'row-click', value: unknown): void,
  (e: 'add', value: unknown): void,
  (e: 'add-option', value: string): void,
  (e: 'remove', value: unknown): void,
  (e: 'update:filter', value: string | null | undefined): void,
  (e: 'update:selected', value: unknown[]): void,
}>()

const { api } = useFeathers()

const currentSelected = useSyncedProp(props, 'selected', emit)

const currentFilter = useSyncedProp(props, 'filter', emit)

const { cleanupQuery } = useQuery()

const { tableFields } = useTable()

const dataRows = ref([])

const data = ref([])

const { data: userTables } = api.service('tables').useFind({ query: {} })

const table = computed(() => (
  userTables.value?.[0]?.list.find((tt) => tt._id === props.tableId)
))

const fields = computed(() => (
  tableFields(
    table.value?.fields || [],
    table.value?.created,
    table.value?.updated,
    table.value?.softDelete,
  )
))

let filterTimeout = 0

watch([
  () => props.rows,
  () => props.tableId,
  () => props.query,
  currentFilter,
], () => {
  const f = filterToMongo(currentFilter.value || '', fields.value) || {}

  const { $limit, $skip } = props.query || {}
  const queryProp = omit(props.query || {}, ['$limit', '$skip'])

  const query: AnyData = cleanupQuery({
    $and: [
      Object.keys(queryProp).length ? queryProp : undefined,
      Object.keys(f).length ? f : undefined,
    ],
  })

  if (typeof $limit === 'number') {
    query.$limit = $limit || 10
  }
  if (typeof $skip === 'number') {
    query.$skip = $skip || 0
  }

  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    if (props.tableId) {
      const dataFind = api.service(props.tableId).useFind({ query, temps: props.temps })
      dataFind.find({ query })
      watch(dataFind.data, () => {
        data.value = dataFind.data.value
      }, { immediate: true })
      return
    }

    if (props.rows) {
      const s = sift(query)
      dataRows.value = props.rows?.filter(s) || []
    }
  }, 500)
}, { immediate: true })

const filteredRows = computed(() => data.value || dataRows.value)
</script>

<style scoped lang="sass">
:deep(.q-table)
  & .q-td:last-child,
  & th:last-child
    padding-right: 32px

:deep(.q-table__bottom)
  padding-right: 32px

.remove-button
  position: absolute
  right: 0

.add-button
  &.end
    position: absolute
    right: 20px
    bottom: 10px
</style>

<template>
  <q-table
    v-model:selected="currentSelected"
    v-bind="$attrs"
    :rows="filteredRows"
    :columns="columns as any"
    :selection="selectionStyle"
  >
    <template #top>
      <div class="row q-gutter-sm full-width items-center">
        <div class="col-auto">
          {{ $attrs.title }}
        </div>

        <div class="col">
          <filter-editor
            v-if="!hideFilter"
            v-model="currentFilter"
            class="full-width"
            :fields="fields"
            placeholder="Filter expression (ex: field:value)"
            clearable
            dense
            outlined
          />
        </div>

        <div class="col-auto">
          <add-button
            v-if="addButton === 'start'"
            :label="addLabel"
            :disable="disable || addDisable"
            :options="addOptions"
            @click="addRow"
            @click-option="(value) => $emit('add-option', value)"
          />
        </div>
      </div>
    </template>

    <template #body="p">
      <q-tr
        :props="p"
        @mouseover="hover = p.row._id"
        @mouseleave="hover = undefined"
        @focus="hover = p.row.id"
        @blur="hover = undefined"
        @click="$emit('row-click', p.row)"
      >
        <q-td
          v-if="$attrs.selection !== 'none'"
          class="q-table--col-auto-width"
        >
          <q-checkbox
            v-if="$attrs.selection === 'multiple'"
            v-model="p.selected"
            dense
          />
        </q-td>

        <q-td
          v-for="col in p.cols"
          :key="col.field"
          class="cursor-pointer"
          :props="p"
        >
          <property-schema-field
            v-if="schemaRows && schemaSchema(col.field)"
            v-model="p.row[col.field]"
            :parent="p.row"
            :schema="schemaSchema(col.field)"
            :key-name="col.field"
            :label="col.label"
          />

          <span v-else>
            {{ col.format ? col.format(p.row[(col as any).field]) : p.row[(col as any).field] }}
          </span>
        </q-td>

        <q-btn
          v-if="removeButton === 'end' && (!canRemove || canRemove(p.row))"
          v-show="hover === p.row._id"
          class="remove-button"
          :disable="disable || removeDisable"
          :icon="removeIcon || 'mdi-trash-can-outline'"
          color="red-6"
          size="sm"
          round
          flat
          @click.stop="removeRow(p.row)"
        >
          <q-tooltip :delay="500">
            {{ removeLabel || 'Delete' }}
          </q-tooltip>
        </q-btn>
      </q-tr>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-table>

  <add-button
    v-if="addButton === 'end'"
    :label="addLabel"
    :disable="disable || addDisable"
    :options="addOptions"
    @click="addRow"
    @click-option="(value) => $emit('add-option', value)"
  />
</template>

<script setup lang="ts">
import {
  computed, ref, useAttrs, watch,
} from 'vue'
import sift from 'sift'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useSyncedProp } from '@/composites/prop'
import { columnAlignmentFor, getTypeFor, schemaToField } from '@/shared/schema'
import { filterToMongo } from '@/composites/filter'
import { AddOption } from '@/features/Fields/interfaces'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import AddButton from '@/features/Fields/components/AddButton.vue'
import FilterEditor from '@/features/Tables/components/FilterEditor.vue'

const attrs = useAttrs()

const props = defineProps<{
  // rows to display in table
  rows: unknown[]
  // schema to generate columns with
  schema?: TSchema
  // 2-ways binding for selected rows
  selected?: unknown[]
  // 2-ways binding for filter string
  filter?: string
  // when this value is true, no filtering is done on the rows, you need to filter them yourself
  customFilter?: boolean
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

const currentSelected = useSyncedProp(props, 'selected', emit)

const currentFilter = useSyncedProp(props, 'filter', emit)

const columns = computed(() => {
  if (!props.schema) {
    return attrs.columns
  }

  const cols = []
  Object.keys(props.schema.properties).forEach((k) => {
    const p = props.schema.properties[k]
    const c = {
      name: k,
      label: startCase(k),
      field: k,
      align: columnAlignmentFor(getTypeFor(p)),
      sortable: true,
    }
    cols.push(c)
  })
  return cols
})

const hover = ref()

const fields = computed(() => (
  Object.keys(props.schema.properties).map((k) => (
    schemaToField(k, props.schema.properties[k])
  ))
))

let filterTimeout = 0

const filteredRows = ref([])

watch(() => props.rows, () => {
  if (props.customFilter) {
    filteredRows.value = props.rows
  }
})

watch([
  () => props.rows,
  currentFilter,
], () => {
  if (!props.customFilter) {
    const query = filterToMongo(currentFilter.value || '', fields.value) || {}

    clearTimeout(filterTimeout)
    filterTimeout = setTimeout(() => {
      if (props.rows) {
        const s = sift(query)
        filteredRows.value = props.rows?.filter(s) || []
      }
    }, 500)
  }
}, { immediate: true })

const schemaSchema = (name: string) => props.schema?.properties[name]

const addRow = () => {
  const newValue = props.addFunction ? props.addFunction() : {}
  if (newValue) {
    emit('add', newValue)
  }
}

const removeRow = (value: unknown) => {
  if (!props.canRemove || props.canRemove(value)) {
    if (props.removeFunction) {
      props.removeFunction(value)
    }
    emit('remove', value)
  }
}
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

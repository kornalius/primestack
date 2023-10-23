<template>
  <q-table
    v-model:pagination="currentPagination"
    v-model:selected="currentSelected"
    v-bind="$attrs"
    :rows="filteredRows"
    :columns="columns as any"
    :selection="selectionStyle"
    :visible-columns="($attrs.visibleColumns?.length
      ? $attrs.visibleColumns
      : undefined
    ) as unknown[]"
    @request="(p) => $emit('request', p)"
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
            :placeholder="$t('filter.expression')"
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
        class="cursor-pointer"
        :props="p"
        @mouseover="hover = p.row._id"
        @mouseleave="hover = undefined"
        @focus="hover = p.row.id"
        @blur="hover = undefined"
        @click="$emit('row-click', p.row)"
      >
        <q-td
          v-if="![undefined, 'none'].includes(selectionStyle)"
          class="q-table--col-auto-width"
        >
          <q-checkbox
            v-if="selectionStyle === 'multiple'"
            v-model="p.selected"
            dense
          />
        </q-td>

        <q-td
          v-for="col in p.cols"
          :key="col.name"
          :props="p"
        >
          <property-schema-field
            v-if="editing[getId(p.row)] && fieldSchema(col.field)"
            v-model="p.row[col.field]"
            :parents="[p.row]"
            :schema="fieldSchema(col.field)"
            :prop-name="col.field"
            :label="col.label"
            horizontal
          />

          <span v-else>
            {{
              col.format
                ? col.format(col.value)
                : col.value
            }}
          </span>
        </q-td>

        <q-td>
          <q-btn
            v-if="editable && !showConfirmButtons(p.row)"
            :class="{ 'edit-button': true, remove: showRemoveButton(p.row) }"
            :style="{ opacity: hover === p.row._id ? 1 : 0 }"
            :disable="disable"
            :icon="editIcon || 'mdi-pencil'"
            color="grey-8"
            size="sm"
            round
            flat
            @click.stop="editRow(p.row)"
          >
            <q-tooltip :delay="500">
              {{ editLabel || $t('buttons.edit') }}
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="showConfirmButtons(p.row)"
            class="save-button"
            :disable="disable"
            :icon="saveIcon || 'mdi-check'"
            color="green-6"
            size="sm"
            round
            flat
            @click.stop="saveRow(p.row)"
          >
            <q-tooltip :delay="500">
              {{ saveLabel || $t('buttons.save') }}
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="showConfirmButtons(p.row)"
            class="cancel-button"
            :disable="disable"
            :icon="cancelIcon || 'mdi-close'"
            color="red-6"
            size="sm"
            round
            flat
            @click.stop="cancelRow(p.row)"
          >
            <q-tooltip :delay="500">
              {{ cancelLabel || $t('buttons.cancel') }}
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="showRemoveButton(p.row)"
            class="remove-button"
            :style="{ opacity: hover === p.row._id ? 1 : 0 }"
            :disable="disable || removeDisable"
            :icon="removeIcon || 'mdi-trash-can-outline'"
            color="red-6"
            size="sm"
            round
            flat
            @click.stop="removeRow(p.row)"
          >
            <q-tooltip :delay="500">
              {{ removeLabel || $t('buttons.delete') }}
            </q-tooltip>
          </q-btn>
        </q-td>
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
import omit from 'lodash/omit'
import { TSchema } from '@feathersjs/typebox'
import { useSyncedProp } from '@/composites/prop'
import { columnAlignmentFor, getTypeFor, schemaToField } from '@/shared/schema'
import { filterToMongo } from '@/composites/filter'
import { AddOption, Pagination } from '@/features/Fields/interfaces'
import { AnyData } from '@/shared/interfaces/commons'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import AddButton from '@/features/Fields/components/AddButton.vue'
import FilterEditor from '@/features/Tables/components/FilterEditor.vue'

const attrs = useAttrs()

const props = defineProps<{
  // rows to display in table
  rows: unknown[]
  // key for rows
  rowKeys?: string[]
  // pagination
  pagination?: Pagination
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
  // Can we edit the rows?
  editable?: boolean
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
  // returns true if the row is considered modified
  isRowModified?: (row: AnyData) => boolean
  // icon for the save button
  saveIcon?: string
  // label for the save button
  saveLabel?: string
  // icon for the cancel button
  cancelIcon?: string
  // label for the cancel button
  cancelLabel?: string
  // icon for the edit button
  editIcon?: string
  // label for the edit button
  editLabel?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'row-click', value: unknown): void,
  (e: 'add', value: unknown): void,
  (e: 'add-option', value: string): void,
  (e: 'remove', value: unknown): void,
  (e: 'edit', value: unknown): void,
  (e: 'save', value: unknown): void,
  (e: 'cancel', value: unknown): void,
  (e: 'request', props: unknown): void,
  (e: 'update:filter', value: string | null | undefined): void,
  (e: 'update:selected', value: unknown[]): void,
  (e: 'update:pagination', value: Pagination): void,
}>()

const currentSelected = useSyncedProp(props, 'selected', emit)

const currentPagination = useSyncedProp(props, 'pagination', emit)

const currentFilter = useSyncedProp(props, 'filter', emit)

const columns = computed(() => {
  if (attrs.columns) {
    return attrs.columns.map((c) => omit(c, ['_id']))
  }

  const cols = []
  Object.keys(props.schema?.properties || {}).forEach((k) => {
    const p = props.schema?.properties[k]
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
  Object.keys(props.schema?.properties || {}).map((k) => (
    schemaToField(k, props.schema?.properties[k])
  ))
))

let filterTimeout = 0

const filteredRows = ref([])

watch(() => props.rows, () => {
  if (props.customFilter) {
    filteredRows.value = props.rows
  }
}, { immediate: true })

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

const fieldSchema = (name: string) => props.schema?.properties[name]

const editing = ref({})

const getId = (row: AnyData): string => {
  const keys = props.rowKeys || [attrs['row-key']]
  // eslint-disable-next-line no-restricted-syntax
  for (const k of keys) {
    if (row[k] !== undefined) {
      return row[k] as string
    }
  }
  return undefined
}

const editRow = (row: AnyData) => {
  const id = editing.value[getId(row)]
  if (!editing.value[id]) {
    editing.value[getId(row)] = true
    emit('edit', row)
  }
}

const addRow = () => {
  const newValue = props.addFunction ? props.addFunction() : {}
  if (newValue) {
    emit('add', newValue)
  }
}

const removeRow = (row: AnyData) => {
  if (!props.canRemove || props.canRemove(row)) {
    if (props.removeFunction) {
      props.removeFunction(row)
    }
    emit('remove', row)
  }
}

const showConfirmButtons = (row: AnyData): boolean => (
  editing.value[getId(row)]
)

const showRemoveButton = (row: AnyData): boolean => (
  !showConfirmButtons(row) && props.removeButton === 'end' && (!props.canRemove || props.canRemove(row))
)

const saveRow = (row: AnyData) => {
  emit('save', row)
  delete editing.value[getId(row)]
}

const cancelRow = (row: AnyData) => {
  emit('cancel', row)
  delete editing.value[getId(row)]
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
  top: 50%
  transform: translateY(-50%)
  right: 2px

.edit-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 2px

  &.remove
    right: 36px

.save-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 36px

.cancel-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 2px

.add-button
  &.end
    position: absolute
    right: 20px
    bottom: 10px
</style>

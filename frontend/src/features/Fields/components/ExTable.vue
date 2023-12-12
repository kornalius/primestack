<template>
  <q-table
    v-model:pagination="currentPagination"
    v-model:selected="currentSelected"
    v-bind="$attrs"
    :rows="filteredRows"
    :columns="computedColumns as any"
    :selection="selectionStyle"
    :visible-columns="($attrs.visibleColumns?.length > 0
      ? $attrs.visibleColumns
      : undefined
    ) as unknown[]"
    @request="(r) => $emit('request', r)"
    @row-dblclick="(r) => editRow(r)"
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
            v-if="!!editing[getId(p.row)] && fieldSchema(col.field)"
            v-model="editing[getId(p.row)][col.field]"
            :parents="[p.row]"
            :schema="fieldSchema(col.field)"
            :prop-name="col.field"
            :label="col.label"
            horizontal
            property
          />

          <q-chip
            v-else-if="col.chip"
            style="margin: 0;"
            :text-color="stringValue(col.textColor, p.row)"
            :color="stringValue(col.color, p.row)"
            dense
          >
            {{
              col.format
                ? col.format(col.value)
                : col.value
            }}
          </q-chip>

          <span
            v-else
            :class="rowColClass(col, p.row)"
          >
            {{
              col.format
                ? col.format(col.value)
                : col.value
            }}
          </span>
        </q-td>

        <q-td>
          <!-- Save editing button -->

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

          <!-- Cancel editing button -->

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

          <!-- Actions button -->

          <q-btn
            v-if="
              !showConfirmButtons(p.row)
                && (editable
                  || showRemoveAction(p.row)
                  || actions?.length > 0)
            "
            class="action-button"
            :style="{ opacity: hover === p.row._id ? 1 : 0 }"
            icon="mdi-dots-vertical"
            text-color="grey-9"
            size="sm"
            dense
            round
            flat
          >
            <q-menu fit>
              <q-list dense>
                <!-- Edit action -->

                <q-item
                  v-if="editable"
                  :disable="disable"
                  clickable
                  v-close-popup
                  v-ripple
                  @click.stop="editRow(p.row)"
                >
                  <q-item-section avatar>
                    <q-icon
                      :name="editIcon || 'mdi-pencil'"
                      color="green-5"
                      size="xs"
                    />
                  </q-item-section>

                  <q-item-section>
                    {{ editLabel || $t('buttons.edit') }}
                  </q-item-section>
                </q-item>

                <!-- Remove action -->

                <q-item
                  v-if="showRemoveAction(p.row)"
                  :disable="disable || removeDisable"
                  clickable
                  v-close-popup
                  v-ripple
                  @click.stop="removeRow(p.row)"
                >
                  <q-item-section avatar>
                    <q-icon
                      :name="removeIcon || 'mdi-trash-can-outline'"
                      color="red-4"
                      size="xs"
                    />
                  </q-item-section>

                  <q-item-section>
                    {{ removeLabel || $t('buttons.delete') }}
                  </q-item-section>
                </q-item>

                <q-separator
                  v-if="editable || showRemoveAction(p.row)"
                />

                <!-- Actions -->

                <q-item
                  v-for="action in actions"
                  :key="action.label"
                  clickable
                  v-close-popup
                  v-ripple
                  @click="runAction(action, p.row)"
                >
                  <q-item-section v-if="action.icon" avatar>
                    <q-icon
                      :name="action.icon"
                      :color="action.color"
                      size="xs"
                    />
                  </q-item-section>

                  <q-item-section>
                    {{ action.label }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>
  </q-table>

  <add-button
    v-if="addButton === 'end'"
    class="add-button end"
    :label="addLabel"
    :disable="disable || addDisable"
    :options="addOptions"
    :flat="false"
    color="white"
    text-color="primary"
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
import { Static, TSchema } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useSyncedProp } from '@/composites/prop'
import { useFormElements } from '@/features/Forms/composites'
import { useExpression } from '@/features/Expression/composites'
import { useFilter } from '@/features/Filter/composites'
import { getTypeFor, schemaToField } from '@/shared/schema'
import {
  AddOption,
  ExTableColumn,
  ExTableRowAction,
  Pagination,
} from '@/features/Fields/interfaces'
import { AnyData } from '@/shared/interfaces/commons'
import { tableFieldSchema } from '@/shared/schemas/table'
import { stringValue } from '@/composites/utilities'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import AddButton from '@/features/Fields/components/AddButton.vue'
import FilterEditor from '@/features/Filter/components/FilterEditor.vue'

type TableField = Static<typeof tableFieldSchema>

const attrs = useAttrs()

const props = defineProps<{
  // rows to display in table
  rows: unknown[]
  // table columns definitions
  columns?: ExTableColumn[]
  // row action buttons
  actions?: ExTableRowAction[]
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
  // function to clone the row for editing purposes
  cloneFunction?: (row: unknown) => unknown | undefined
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
  // should we show the remove action?
  removeButton?: boolean
  // icon for the remove button
  removeIcon?: string
  // function called before removing item at index
  canRemove?: (row: unknown) => boolean
  // label for the remove button
  removeLabel?: string
  // function to execute to remove an item from the table
  removeFunction?: (row: unknown) => void
  // should we disable the remove row feature
  removeDisable?: boolean
  // type of selection allowed
  selectionStyle?: 'single' | 'multiple' | 'none'
  // returns true if the row is considered modified
  isRowModified?: (row: unknown) => boolean
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

const { callEventAction } = useFormElements()

const { filterToMongo } = useFilter()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

/**
 * Get the alignment for a column in a table based on its field type
 *
 * @param type Field type
 *
 * @returns {string} Alignment
 */
const columnAlignmentFor = (type: string): string => {
  if (type === 'boolean') {
    return 'center'
  }
  if (type === 'number') {
    return 'right'
  }
  return 'left'
}

const computedColumns = computed(() => {
  if (props.columns) {
    return props.columns.map((c) => omit(c, ['_id']))
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
  )) as TableField[]
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

/**
 * Get the TSchema for a column
 *
 * @param name Name of the column
 *
 * @returns {TSchema}
 */
const fieldSchema = (name: string): TSchema => {
  const col = props.columns.find((c) => c.field === name || c.name === name)
  const cf = col
    ? {
      type: col.type,
      format: col.editFormat,
      color: col.color,
      min: col.min,
      max: col.max,
      pattern: col.pattern,
      slider: col.slider,
      exclusiveMin: col.exclusiveMin,
      exclusiveMax: col.exclusiveMax,
      dateMin: col.dateMin,
      dateMax: col.dateMax,
      dateExclusiveMin: col.dateExclusiveMin,
      dateExclusiveMax: col.dateExclusiveMax,
      options: col.options,
      multiple: col.multiple,
      toggles: col.toggles,
      chip: col.chip,
      rating: col.rating,
      ratingIcon: col.ratingIcon,
      ratingFilled: col.ratingIconFilled,
      ratingHalf: col.ratingIconHalf,
    }
    : {} as TableField
  return {
    ...(props.schema?.properties[name] || {}),
    ...Object.keys(cf)
      .filter((k) => cf[k] !== undefined)
      .reduce((acc, k) => ({
        ...acc,
        [k]: cf[k],
      }), {}),
  }
}

/**
 * Returns the column class for the row display
 *
 * @param col Column
 * @param row Row
 *
 * @returns {string}
 */
const rowColClass = (col: ExTableColumn, row: AnyData): string => {
  const c = []
  c.push(stringValue(col.textColor, row))
  c.push(stringValue(col.color, row))
  return c.join(' ')
}

/**
 * Editing state for rows
 */
const editing = ref({})

/**
 * Get the id from a row
 *
 * @param row Row to get the id from
 *
 * @returns {string}
 */
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

/**
 * Start editing on a specific row
 *
 * @param row Row to start editing on
 */
const editRow = (row: AnyData) => {
  const id = getId(row)
  if (props.editable && !editing.value[id]) {
    editing.value[id] = props.cloneFunction ? props.cloneFunction(row) : row
    emit('edit', row)
  }
}

/**
 * Add a new row
 */
const addRow = () => {
  const newValue = props.addFunction ? props.addFunction() : {}
  if (newValue) {
    emit('add', newValue)
  }
}

/**
 * Remove a specific row
 *
 * @param row Row to remove
 */
const removeRow = (row: AnyData) => {
  if (!props.canRemove || props.canRemove(row)) {
    if (props.removeFunction) {
      props.removeFunction(row)
    }
    const id = getId(row)
    emit('remove', row)
    delete editing.value[id]
  }
}

/**
 * Should we show the editing confirmation buttons?
 *
 * @param row Row to show the buttons on
 *
 * @returns {boolean}
 */
const showConfirmButtons = (row: AnyData): boolean => (
  !!editing.value[getId(row)]
)

/**
 * Should we show the remove action for a specific row
 *
 * @param row Row to show the action on
 *
 * @returns {boolean}
 */
const showRemoveAction = (row: AnyData): boolean => (
  !showConfirmButtons(row) && props.removeButton && (!props.canRemove || props.canRemove(row))
)

/**
 * Save the editing for a row
 *
 * @param row Row to save the editing from
 */
const saveRow = (row: AnyData) => {
  const id = getId(row)
  emit('save', editing.value[getId(row)])
  delete editing.value[id]
}

/**
 * Cancel row editing
 *
 * @param row Row to cancel editing on
 */
const cancelRow = (row: AnyData) => {
  const id = getId(row)
  emit('cancel', editing.value[getId(row)])
  delete editing.value[id]
}

/**
 * Run a row action from the dropdown menu
 *
 * @param action Row action to execute
 * @param row Row it is run on
 */
const runAction = async (action: ExTableRowAction, row: AnyData) => {
  await callEventAction(action.click, ctx, (value: AnyData) => ({ value }))(row)
}
</script>

<style scoped lang="sass">
:deep(.q-table)
  & .q-td:last-child,
  & th:last-child
    padding-right: 32px

:deep(.q-table__bottom)
  padding-right: 32px

.action-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  right: 2px

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
    bottom: 118px
</style>

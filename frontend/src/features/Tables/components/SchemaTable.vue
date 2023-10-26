<template>
  <ex-table
    v-model:pagination="currentPagination"
    v-model:selected="currentSelected"
    v-model:filter="tempFilter"
    v-bind="$attrs"
    :rows="filteredRows"
    :schema="schemaForRows"
    :hide-filter="hideFilter"
    :editable="editable"
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
    :loading="isPending"
    :row-keys="[$attrs.rowKey as string, '__tempId']"
    custom-filter
    @add="addRecord"
    @add-option="(value) => $emit('add-option', value)"
    @row-click="(value) => $emit('row-click', value)"
    @remove="removeRecord"
    @edit="editRecord"
    @save="saveRecord"
    @cancel="cancelRecord"
    @request="paginationRequest"
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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { TSchema } from '@feathersjs/typebox'
import { useSyncedProp } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathersService } from '@/composites/feathers'
// eslint-disable-next-line import/no-cycle
import { useQuery } from '@/features/Query/composites'
import { useTable } from '@/features/Tables/composites'
import { filterToMongo } from '@/composites/filter'
import { getId } from '@/composites/utilities'
import { fieldsToSchema } from '@/shared/schema'
import { ExtraField } from '@/features/Tables/interfaces'
import { AddOption, Pagination } from '@/features/Fields/interfaces'
import { buildCtx, getProp } from '@/features/Expression/composites'
import ExTable from '@/features/Fields/components/ExTable.vue'

const props = defineProps<{
  // rows to display in table
  rows?: unknown[]
  // schema to generate columns with
  schema?: TSchema
  // Fields to automatically add to filter or document in creation mode
  extraFields?: ExtraField[]
  // pagination
  pagination?: Pagination
  // 2-ways binding for selected rows
  selected?: unknown[]
  // 2-ways binding for filter string
  filter?: string
  // should we hide the filter
  hideFilter?: boolean
  // Can the rows be edited?
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
  (e: 'edit', value: unknown): void,
  (e: 'add', value: unknown): void,
  (e: 'cancel', value: unknown): void,
  (e: 'request', props: unknown): void,
  (e: 'update:filter', value: string | null | undefined): void,
  (e: 'update:selected', value: unknown[]): void,
  (e: 'update:pagination', value: Pagination): void,
}>()

const currentSelected = useSyncedProp(props, 'selected', emit)

const currentPagination = useSyncedProp(props, 'pagination', emit)

const tempFilter = useSyncedProp(props, 'filter', emit)

const currentFilter = ref()

const { cleanupQuery, valueForField } = useQuery()

const { tableFields } = useTable()

const quasar = useQuasar()

const { t } = useI18n()

const dataRows = ref([])

const data = ref()

const isPending = ref()

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const ctx = buildCtx()

const table = computed(() => (
  userTable.value?.list.find((tt) => tt._id === props.tableId)
))

const fields = computed(() => (
  tableFields(
    table.value?.fields || [],
    table.value?.created,
    table.value?.updated,
    table.value?.softDelete,
  )
))

const schemaForRows = computed(() => (
  props.schema || (table.value && fieldsToSchema(table.value.fields, props.tableId))
))

let timeout = 0

watch(tempFilter, () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    currentFilter.value = tempFilter.value
  }, 1000)
})

const cpagination = {
  limit: ref(10),
  skip: ref(0),
}

const query = computed(() => {
  const f = filterToMongo(currentFilter.value || '', fields.value) || {}

  // const { $limit, $skip } = props.query || {}
  const queryProp = omit(props.query || {}, ['$limit', '$skip'])

  const extraFields = props.extraFields && props.extraFields
    .filter((ef) => ef.filter)
    .reduce((acc, ef) => {
      let value = getProp(ef.value, ctx)
      const field = fields.value.find((ff) => ff.name === ef.fieldname)
      if (field) {
        value = valueForField(value, field.type as string)
      }
      return { ...acc, [ef.fieldname]: value }
    }, {})

  return cleanupQuery({
    $and: [
      Object.keys(queryProp).length ? queryProp : undefined,
      Object.keys(f).length ? f : undefined,
      Object.keys(extraFields || {})?.length ? extraFields : undefined,
    ],
  })

  // if (typeof $limit === 'number') {
  //   q.$limit = currentPagination.value?.$limit || $limit || cpagination.limit.value || 10
  // }
  // if (typeof $skip === 'number') {
  //   q.$skip = currentPagination.value?.$skip || $skip || cpagination.skip.value || 0
  // }

  // return q
})

let paginationFind

const useFindParams = computed(() => ({
  query: query.value,
  temps: props.temps,
}))

/**
 * To start fetching on the table
 */
watch(() => props.tableId, () => {
  if (props.tableId) {
    paginationFind = useFeathersService(props.tableId)
      .useFind(useFindParams, {
        pagination: cpagination,
        paginateOn: 'hybrid',
      })
    paginationFind.find()

    watch(paginationFind.total, () => {
      currentPagination.value.rowsNumber = paginationFind.total.value
    }, { immediate: true })

    watch(paginationFind.data, () => {
      data.value = paginationFind.data.value
    }, { immediate: true })

    watch(paginationFind.currentPage, () => {
      currentPagination.value.page = paginationFind.currentPage.value as number
    }, { immediate: true })

    watch(() => paginationFind.isPending.value, () => {
      isPending.value = paginationFind.isPending.value
    }, { immediate: true })
  }
}, { immediate: true })

const paginationRequest = (r) => {
  cpagination.limit.value = r.pagination.rowsPerPage
  currentPagination.value.rowsPerPage = r.pagination.rowsPerPage
  paginationFind.toPage(r.pagination.page)
}

/**
 * Watcher for hard-coded rows from props
 */
watch([() => props.rows, query], () => {
  if (props.rows) {
    const s = sift(query.value)
    dataRows.value = props.rows.filter(s) || []
  }
}, { immediate: true })

/**
 * Computes the filteredRows, when data or dataRows change
 */
const filteredRows = computed(() => data.value || dataRows.value || [])

const addRecord = (value?: AnyData) => {
  if (props.tableId) {
    const extraFields = props.extraFields && props.extraFields
      .filter((ef) => ef.create)
      .reduce((acc, ef) => {
        let v = getProp(ef.value, ctx)
        const field = fields.value.find((ff) => ff.name === ef.fieldname)
        if (field) {
          v = valueForField(v, field.type as string)
        }
        return { ...acc, [ef.fieldname]: v }
      }, {})

    const r = useFeathersService(props.tableId).new({
      ...value,
      ...extraFields,
    })
    r.createInStore()
    currentSelected.value = [r]
    emit('add', r)
  } else {
    emit('add', value)
  }
}

/**
 * Get or fetch record
 *
 * @param id ID of the record
 */
const getRecord = async (id: string): Promise<AnyData> => {
  if (props.tableId) {
    const s = useFeathersService(props.tableId).getFromStore(id, { temps: true })
    if (!s.value) {
      return useFeathersService(props.tableId).get(id)
    }
    return s.value
  }
  return undefined
}

/**
 * Confirm removal of record
 *
 * @param value Selected row value from the table
 */
const removeRecord = (value: AnyData) => {
  if (props.tableId) {
    quasar.dialog({
      title: t('record.dialog.delete.title'),
      persistent: true,
      message: t('record.dialog.delete.message'),
      ok: {
        label: t('dialog.ok'),
        color: 'green',
        outline: true,
      },
      cancel: {
        label: t('dialog.cancel'),
        color: 'negative',
        outline: true,
      },
    }).onOk(async () => {
      const r = await getRecord(getId(value))
      if (r) {
        const tempId = r.__tempId
        await r.remove()
        if (tempId) {
          useFeathersService(props.tableId).removeFromStore(tempId)
        }
        emit('remove', r)
      }
    })
  } else {
    emit('remove', value)
  }
}

const editRecord = async (value: AnyData) => {
  value.clone()
}

const saveRecord = async (value: AnyData) => {
  const tempId = value.__tempId
  await value.save()
  if (tempId) {
    useFeathersService(props.tableId).removeFromStore(tempId)
  }
}

const cancelRecord = (value: AnyData) => {
  value.reset()
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

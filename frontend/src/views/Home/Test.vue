<template>
  <q-page class="q-pa-sm">
    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      dense
    >
      <q-tab name="ArrayEditor" label="Array Editor" />
      <q-tab name="PropertiesEditor" label="Properties Editor" />
      <q-tab name="QueryEditor" label="Query Editor" />
      <q-tab name="Table" label="ExTable" />
      <q-tab name="Columns" label="Columns Select" />
      <q-tab name="Tags" label="Tags Select" />
      <q-tab name="Stats" label="Stats" />
      <q-tab name="ValueBoxes" label="Value Boxes" />
      <q-tab name="JsonEditor" label="Json Editor" />
      <q-tab name="Pagination" label="Pagination Test" />
      <q-tab name="Units" label="Units Input" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="ArrayEditor">
        <array-editor
          v-model="testArray"
          v-model:valid="valid"
          v-model:selection="selection"
          class="q-mb-sm"
          :item-key="(value) => value as string"
          :add-function="addItem"
          :remove-function="removeItem"
          :height="300"
          :min="1"
          :max="3"
          add-label="New"
          clear-label="Clear"
          clearable
          reorderable
          selectable
          @clear="() => { testArray.length = 0 }"
        >
          <template #default="{ value, hover }">
            <div :style="{ background: hover ? 'whitesmoke' : '' }">
              {{ value }}
            </div>
          </template>
        </array-editor>

        <div v-if="valid">
          Array is valid
        </div>

        <div>Selection</div>

        <pre>{{ selection }}</pre>

        <pre>{{ testArray }}</pre>
      </q-tab-panel>

      <q-tab-panel name="PropertiesEditor">
        <properties-editor
          v-model="testProperties"
          v-model:forced-types="forcedTypes"
          :parents="[]"
          :prop-name="''"
          :schema="schema"
        />

        <pre>{{ testProperties }}</pre>
        <pre>{{ forcedTypes }}</pre>
      </q-tab-panel>

      <q-tab-panel name="QueryEditor">
        <div class="row">
          <div class="col-8">
            <query-editor v-model="query" />
          </div>

          <div class="col q-ml-md">
            <pre>{{ mongoQuery }}</pre>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Table">
        <div class="row">
          <div class="col">
            <ex-table
              class="my-sticky-dynamic"
              :schema="schema"
              :rows="rows"
              :virtual-scroll-slice-size="10"
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :rows-per-page-options="[0]"
              row-key="_id"
              virtual-scroll
              editable
              flat
              bordered
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Columns">
        <div class="row">
          <div class="col">
            <columns-select
              v-model="columnValue"
              :columns="columns"
              :options="columnsOptions"
              value-field="_id"
              use-chips
              dense
              options-dense
              multiple
              clearable
              outlined
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Tags">
        <div class="row">
          <div class="col">
            <tags-select
              v-model="tags"
              table-id="64b806da03ac5093de3f3e78"
              field="stringField"
              multiple
              use-chips
              clearable
              options-dense
              dense
              outlined
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Stats">
        <div class="row">
          <div class="col">
            <div>Count: {{ count?.value || 0 }}</div>
            <div>Sum: {{ sum?.value || 0 }}</div>
            <div>Average: {{ avg?.value || 0 }}</div>
            <div>Mininum: {{ min?.value || 0 }}</div>
            <div>Maximum: {{ max?.value || 0 }}</div>
            <div>Empty: {{ empty?.value || 0 }}</div>
            <div>Not Empty: {{ notEmpty?.value || 0 }}</div>
            <div>% Empty: {{ pctEmpty?.value || 0 }}</div>
            <div>% Not Empty: {{ pctNotEmpty?.value || 0 }}</div>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="ValueBoxes">
        <div class="row q-gutter-sm items-center">
          <div class="col">
            <value-box
              :model-value="137845"
              :diff="0.682"
              :diff-digits="2"
              value-color="white"
              value-format="currency"
              label="Profile Report"
              label-color="white"
              tag="YEAR 2023"
              tag-color="orange"
              diff-format="percent"
              icon="mdi-lead-pencil"
              color="grey-8"
              icon-color="grey-5"
              diff-color="green-4"
              diff-icon="mdi-arrow-up"
              diff-icon-color="green-4"
              diff-icon-size="xs"
            />
          </div>

          <div class="col">
            <value-box
              :model-value="-137845"
              value-color="white"
              value-format="currency"
              label="Profile Report"
              label-color="white"
              tag="YEAR 2022"
              tag-color="orange"
              icon="mdi-chat"
              icon-color="blue-grey-6"
              color="blue-4"
            />
          </div>

          <div class="col">
            <value-box
              :model-value="137845"
              :diff="0.682"
              :diff-digits="2"
              :container-class="{ 'shadow-4': true }"
              value-color="grey-8"
              value-format="currency"
              label="Profile Report"
              label-color="grey-8"
              label-style="subtitle1"
              icon="mdi-chart-line"
              icon-color="orange-6"
              color="orange-3"
              diff-color="green-4"
              diff-format="percent"
              diff-icon="mdi-arrow-up"
              diff-icon-color="green-4"
              diff-icon-size="xs"
              diff-icon-suffix
            />
          </div>

          <div class="col">
            <stat-box
              type="count"
              table-id="64b806da03ac5093de3f3e78"
              field="numberField"
              value-color="grey-8"
              value-style="subtitle2"
              label-color="grey-8"
              label-style="subtitle1"
              icon="mdi-chart-line"
              icon-color="red-6"
              color="red-3"
              diff-color="green-4"
              diff-style="subtitle2"
              diff-icon-color="green-4"
              diff-icon-size="xs"
              diff-icon-suffix
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="JsonEditor">
        <div class="row q-gutter-sm">
          <div class="col">
            <json-editor v-model="json" />
          </div>
          <div class="col">
            <code-editor
              v-model="jsonText"
              class="code-editor"
              style="width: 100%; height: 100vh; background: white;"
              lang-json
            />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Pagination">
        <q-btn label="Add Record" @click="addRecord" />

        <q-table
          v-model:pagination="currentPagination"
          :rows="paginatedRows"
          @request="paginationRequest"
        />
        <pre>{{ currentPagination }}</pre>
        <pre>{{ pagination }}</pre>
        <pre>{{ paginationFind }}</pre>
      </q-tab-panel>

      <q-tab-panel name="Units">
        <div class="row q-gutter-sm">
          <div class="col-1">
            <unit-input
              v-model="unitValue1"
              :units="units"
              default-unit="px"
            />
          </div>

          <div class="col-1">
            <unit-input
              v-model="unitValue2"
              :units="units"
              default-unit="%"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, Ref, ref, watch,
} from 'vue'
import sample from 'lodash/sample'
import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useQuery } from '@/features/Query/composites'
import { useFeathersService } from '@/composites/feathers'
import { useExpression } from '@/features/Expression/composites'
import { useStats } from '@/features/Stats/store'
import { Query } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import QueryEditor from '@/features/Query/components/Editor/QueryEditor.vue'
import ExTable from '@/features/Fields/components/ExTable.vue'
import ColumnsSelect from '@/features/Fields/components/ColumnsSelect.vue'
import TagsSelect from '@/features/Tables/components/TagsSelect.vue'
import ValueBox from '@/features/Fields/components/ValueBox.vue'
import StatBox from '@/features/Tables/components/StatBox.vue'
import JsonEditor from '@/features/Json/components/Editor/JsonEditor.vue'
import CodeEditor from '@/features/Expression/components/CodeEditor.vue'
import UnitInput from '@/features/Fields/components/UnitInput.vue'

/**
 * Properties
 */

const testProperties = ref({
  string: '',
  number: 0,
  range: 5,
  date: '',
  time: '',
  boolean: false,
  select: '',
  multipleSelect: [],
  color: '',
  arrayOfString: [],
  arrayOfObject: [],
  obj: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

const forcedTypes = ref({})

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const schema = Type.Object({
  string: Type.Union([Type.String(), Type.Number()]),
  number: Type.Number(),
  range: Type.Number({
    slider: true,
    min: 0,
    max: 10,
    step: 0.5,
  }),
  date: Type.String({ format: 'date' }),
  time: Type.String({ format: 'time' }),
  boolean: Type.Boolean(),
  select: Type.String({
    options: [
      {
        label: 'Quebec',
        value: 'QC',
      },
      {
        label: 'Ontario',
        value: 'ON',
      },
      {
        label: 'British Columbia',
        value: 'BC',
      },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  }),
  multipleSelect: Type.Array(Type.String({
    options: [
      {
        label: 'Quebec',
        value: 'QC',
      },
      {
        label: 'Ontario',
        value: 'ON',
      },
      {
        label: 'British Columbia',
        value: 'BC',
      },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  })),
  color: Type.String({ color: true }),
  arrayOfString: Type.Array(Type.Union([Type.String(), Type.Number()])),
  arrayOfObject: Type.Array(Type.Object({
    string: Type.Union([Type.String(), Type.Number()]),
    check: Type.Boolean(),
  })),
  obj: Type.Object({
    string: Type.Union([Type.String(), Type.Number()]),
    top: Type.Number(),
    left: Type.Number(),
    bottom: Type.Number(),
    right: Type.Number(),
  }),
})

const tab = ref('ArrayEditor')

/**
 * Array
 */

const testArray = ref(['item #1', 'item #2'])

const addItem = (): unknown | undefined => {
  const newValue = `Item #${testArray.value.length + 1}`
  testArray.value.push(newValue)
  return newValue
}

const removeItem = (value: unknown, index: number): boolean => {
  testArray.value.splice(index, 1)
  return true
}

const valid = ref(false)

const selection = ref([])

/**
 * Query
 */

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const { queryToMongo } = useQuery()

const query = ref({ limit: 10, skip: 0, groups: [] }) as Ref<Query>

const mongoQuery = computed(() => queryToMongo(query.value, userTable.value, ctx.$expr))

/**
 * Table
 */

const rows = ref([])

for (let i = 0; i < 1000; i++) {
  rows.value.push(
    {
      _id: hexObjectId(),
      string: `Test #${i}`,
      number: i,
      range: 2.5,
      date: '2023/07/07',
      time: '10:23',
      boolean: true,
      select: 'QC',
      multipleSelect: ['QC', 'ON'],
      color: 'red-3',
      arrayOfString: ['hello', 'world'],
      arrayOfObject: [{ string: 'string', check: true }, { string: 'string2', check: false }],
      obj: {
        string: 'string',
        top: 10,
        left: 20,
        bottom: 30,
        right: 40,
      },
    },
  )
}

/**
 * Columns Select
 */

const columnValue = ref([])

const columns = ref([
  {
    field: 'colA',
    size: 2,
    filterable: true,
    title: 'Column A',
    titleClass: 'text-bold',
  },
  {
    field: 'colB',
    size: 7,
    filterable: true,
    titleClass: ['text-bold'],
  },
  {
    field: 'colC',
    filterable: true,
    titleClass: { 'text-bold': true },
  },
])

const columnsOptions = ref([])

for (let i = 0; i < 1000; i++) {
  columnsOptions.value.push(
    {
      _id: hexObjectId(),
      colA: sample(['apple', 'orange', 'grape', 'pear', 'blueberry']),
      colB: sample(['apple', 'grape', 'pear', 'blueberry']),
      colC: sample(['apple', 'grape', 'pear', 'blueberry']),
    },
  )
}

/**
 * Tags
 */

const tags = ref([])

/**
 * Stats
 */

const stats = useStats()

const count = stats.count({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField', query: { stringField: 'A' } })
const avg = stats.avg({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const sum = stats.sum({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const min = stats.min({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const max = stats.max({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const empty = stats.empty({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const notEmpty = stats.notEmpty({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const pctEmpty = stats.pctEmpty({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })
const pctNotEmpty = stats.pctNotEmpty({ tableId: '64b806da03ac5093de3f3e78', field: 'numberField' })

/**
 * JSON Editor
 */

const json = ref({
  a: 10,
  b: 20,
  c: {
    c1: 30,
    c2: 40,
  },
  d: [
    { a: 10, b: 20 },
    'string',
    true,
  ],
  e: 'string',
  f: true,
})

const jsonText = ref('{}')

watch(json, () => {
  jsonText.value = JSON.stringify(json.value, undefined, 2)
}, { immediate: true, deep: true })

/**
 * Pagination
 */

const service = computed(() => useFeathersService('64b806da03ac5093de3f3e78'))

const paginationParams = computed(() => ({
  query: {
    $limit: 10,
    $skip: 0,
    $sort: { stringField: 1 },
  },
}))

const pagination = {
  limit: ref(10),
  skip: ref(0),
}

const currentPagination = ref({
  sortBy: null,
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

let paginationFind

const paginatedRows = ref([])

let cancelTotal = () => {}
let cancelData = () => {}
let cancelCurrentPage = () => {}

watch(service, () => {
  cancelTotal()
  cancelTotal = () => {}

  cancelData()
  cancelData = () => {}

  cancelCurrentPage()
  cancelCurrentPage = () => {}

  paginationFind = service.value.useFind(
    paginationParams,
    {
      pagination,
      paginateOn: 'hybrid',
    },
  )
  paginationFind.find()

  cancelTotal = watch(paginationFind.total, () => {
    currentPagination.value.rowsNumber = paginationFind.total.value
  }, { immediate: true })

  cancelData = watch(paginationFind.data, () => {
    paginatedRows.value = paginationFind.data.value
  }, { immediate: true, deep: true })

  // watch(paginationFind.currentQuery, () => {
  //   console.log('paginationFind.currentQuery', paginationFind.currentQuery.value)
  //   if (paginationFind.currentQuery.value) {
  //     paginatedRows.value = paginationFind.allLocalData.value
  //       .filter((r) => paginationFind.currentQuery.value.ids.includes(r._id))
  //   }
  // }, { immediate: true, deep: true })

  cancelCurrentPage = watch(paginationFind.currentPage, () => {
    currentPagination.value.page = paginationFind.currentPage.value as number
  }, { immediate: true })
}, { immediate: true })

onBeforeUnmount(() => {
  cancelTotal()
  cancelData()
  cancelCurrentPage()
})

const paginationRequest = (r) => {
  paginationFind.toPage(r.pagination.page)
}

const addRecord = () => {
  const s = service.value.new({
    stringField: hexObjectId(),
  })
  s.save()
}

/**
 * Units Input
 */

const unitValue1 = ref('16px')
const unitValue2 = ref('100%')

const units = [
  { label: 'px', value: 'px' },
  {
    label: '%',
    value: '%',
    min: 0,
    max: 100,
  },
  { label: 'em', value: 'em' },
]
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.title
  padding: 4px 8px
  background: $grey-6
</style>

<style lang="sass">
.my-sticky-dynamic
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: white
    z-index: 2

  thead tr th
    position: sticky
    z-index: 1

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px

</style>

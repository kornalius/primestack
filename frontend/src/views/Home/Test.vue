<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      align="justify"
      narrow-indicator
      dense
    >
      <q-tab name="ArrayEditor" label="Array Editor" />
      <q-tab name="PropertiesEditor" label="Properties Editor" />
      <q-tab name="QueryEditor" label="Query Editor" />
      <q-tab name="SchemaEditor" label="Schema Editor" />
      <q-tab name="Table" label="Table" />
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

      <q-tab-panel name="SchemaEditor">
        <div class="row">
          <div class="col">
            <schema-editor v-model="userTable.list[0]" />
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="Table">
        <div class="row">
          <div class="col">
            <schema-table
              class="my-sticky-dynamic"
              :schema="schema"
              :rows="rows"
              :virtual-scroll-slice-size="10"
              :virtual-scroll-item-size="48"
              :virtual-scroll-sticky-size-start="48"
              :rows-per-page-options="[0]"
              row-key="_id"
              virtual-scroll
              flat
              bordered
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import {
  computed, Ref, ref,
} from 'vue'
import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { useQuery } from '@/features/Query/composites'
import { useFeathers } from '@/composites/feathers'
import { Query } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import QueryEditor from '@/features/Query/components/Editor/QueryEditor.vue'
import SchemaTable from '@/features/Fields/components/SchemaTable.vue'
import SchemaEditor from '@/features/Tables/components/Editor/TableEditor.vue'

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

const { api } = useFeathers()

const forcedTypes = ref({})

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
 * Schema
 */

const { data: tables } = api.service('tables').useFind({
  query: {},
})

const userTable = computed(() => tables.value?.[0])

/**
 * Query
 */

const { queryToMongo } = useQuery()

const query = ref({ limit: 10, skip: 0, groups: [] }) as Ref<Query>

const mongoQuery = computed(() => queryToMongo(query.value, userTable.value))

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
</script>

<style scoped lang="sass">
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

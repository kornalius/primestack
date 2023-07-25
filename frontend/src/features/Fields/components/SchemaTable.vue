<template>
  <q-table
    v-model:selected="selected"
    v-bind="$attrs"
    :rows="filteredRows as any"
    :columns="columns as any"
  >
    <template v-if="!hideFilter" #top>
      <q-input
        v-model="currentFilter"
        class="full-width"
        placeholder="Filter expression (ex: field:value)"
        dense
        outlined
      >
        <template #append>
          <q-icon name="mdi-magnify" size="xs" />
        </template>
      </q-input>
    </template>

    <template #body-cell="p">
      <q-td :props="p">
        <property-schema-field
          v-if="schemaSchema(p.col.field)"
          v-model="p.row[p.col.field]"
          :parent="p.row"
          :schema="schemaSchema(p.col.field)"
          :key-name="p.col.field"
          :label="p.col.label"
        />
        <span v-else>
          {{ p.value }}
        </span>
      </q-td>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import {
  computed, ref, useAttrs, watch,
} from 'vue'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import sift from 'sift'
import { useSyncedProp } from '@/composites/prop'
import { columnAlignmentFor, getTypeFor } from '@/shared/schema'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathers } from '@/composites/feathers'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import { filterToMongo } from '@/composites/filter'
import { compact } from 'lodash'

const attrs = useAttrs()

const props = defineProps<{
  schema?: TSchema
  selected?: unknown[]
  query?: AnyData
  tableId?: string
  filter?: string
  hideFilter?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:filter', value: string | null | undefined): void,
  (e: 'update:selected', value: unknown[]): void,
}>()

const { api } = useFeathers()

const selected = useSyncedProp(props, 'selected', emit)

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

const dataRows = ref()
let data

watch([
  () => attrs.rows,
  () => props.tableId,
  () => props.query,
  currentFilter,
], () => {
  const f = filterToMongo(currentFilter.value || '') || {}
  const q = {
    $and: compact([
      Object.keys(props.query).length ? props.query : undefined,
      Object.keys(f).length ? f : undefined,
    ]),
  }
  if (q.$and.length === 0) {
    delete q.$and
  }
  if (api.services[props.tableId]) {
    const u = api.service(props.tableId).useFind({ query: q })
    u.find()
    data = u.data
    return
  }
  const s = sift(q)
  dataRows.value = attrs.rows.filter(s)
}, { immediate: true, deep: true })

const schemaSchema = (name: string) => props.schema?.properties[name]

const filteredRows = computed(() => data?.value || dataRows.value)
</script>

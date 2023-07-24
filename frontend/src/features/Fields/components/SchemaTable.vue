<template>
  <q-table
    v-model:selected="selected"
    v-bind="$attrs"
    :rows="data as any"
    :columns="columns as any"
  >
    <template #body-cell="p">
      <q-td :props="p">
        <schema-field
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
import { useSyncedProp } from '@/composites/prop'
import { columnAlignmentFor, getTypeFor } from '@/shared/schema'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathers } from '@/composites/feathers'
import SchemaField from '@/features/Properties/components/SchemaField.vue'

const attrs = useAttrs()

const props = defineProps<{
  schema?: TSchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected?: any[]
  query?: AnyData
  tableId?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const { api } = useFeathers()

const selected = useSyncedProp(props, 'selected', emit)

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

let data

watch([
  () => attrs.rows,
  () => props.tableId,
  () => props.query,
], () => {
  if (api.services[props.tableId]) {
    const u = api.service(props.tableId).useFind({ query: props.query || {} })
    u.find()
    data = u.data
    return
  }
  data = ref(attrs.rows)
}, { immediate: true, deep: true })

const schemaSchema = (name: string) => props.schema?.properties[name]
</script>

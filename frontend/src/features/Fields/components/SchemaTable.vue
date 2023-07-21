<template>
  <q-table
    v-model:selected="selected"
    v-bind="$attrs"
    :columns="columns as any"
  >
    <template #body-cell="{ col, row }">
      <q-td>
        <schema-field
          v-model="row[(col as any).field]"
          :schema="schema((col as any).field)"
          :key-name="(col as any).field"
          :label="(col as any).label"
        />
      </q-td>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-table>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useSyncedProp } from '@/composites/prop'
import { columnAlignmentFor, getTypeFor } from '@/shared/schema'
import SchemaField from '@/features/Properties/components/SchemaField.vue'

const attrs = useAttrs()

const props = defineProps<{
  schema: TSchema
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected?: any[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

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

const schema = (name: string) => props.schema.properties[name]
</script>

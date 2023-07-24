<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :loading="isPending"
    :options="options"
    label="Fieldname"
    option-value="_id"
    option-label="name"
    emit-value
    map-options
  >
    <template v-if="createNew" #before-options>
      <q-item
        dense
        clickable
        @click="$emit('create')"
      >
        <q-item-section>
          <q-item-label class="text-blue-4">
            <q-icon name="mdi-plus" size="xs" />
            {{ createLabel || 'Create new...' }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template #option="{ opt, itemProps }">
      <q-item class="items-center" v-bind="itemProps">
        <q-item-section avatar>
          <q-icon :name="iconForType((opt as any).type)" size="xs" color="grey-7" />
        </q-item-section>

        {{ (opt as any).name }}
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useFeathers } from '@/composites/feathers'
import { useModelValue } from '@/composites/prop'
import { iconForType } from '@/shared/schema'
import { tableFieldSchema } from '@/shared/schemas/table'

type TableFieldSchema = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: string | null | undefined
  tableId?: string
  fields?: TableFieldSchema[]
  createNew?: boolean
  createLabel?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'create'): void,
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const { api } = useFeathers()

const { data: tables, isPending } = api.service('tables').useFind({
  query: {},
})

const table = computed(() => (
  tables.value?.[0]?.list.find((s) => s._id === props.tableId)
))

const options = computed(() => (
  props.fields ? props.fields : table.value?.fields
))
</script>

<template>
  <div class="row">
    <div class="col-3">
      <q-input
        v-model="value.name"
        label="Fieldname"
        dense
        outlined
      />
    </div>

    <div class="col-3">
      <q-select
        v-model="value.type"
        label="Field type"
        :options="supportedFieldTypes"
        options-dense
        dense
        outlined
      />
    </div>

    <div class="col">
      <q-checkbox
        v-model="value.optional"
        label="Optional"
        dense
      />
    </div>

    <div class="col">
      <q-checkbox
        v-model="value.hidden"
        label="Hidden"
        dense
      />
    </div>

    <div class="col">
      <q-checkbox
        v-model="value.readonly"
        label="Readonly"
        dense
      />
    </div>

    <div class="col">
      <q-checkbox
        v-model="value.queryable"
        label="Queryable"
        dense
      />
    </div>

    <div class="col">
      <q-checkbox
        v-model="value.array"
        label="Array"
        dense
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { schemaField, supportedFieldTypes } from '@/shared/schemas/schema'

type SchemaField = Static<typeof schemaField>

const props = defineProps<{
  modelValue: SchemaField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: SchemaField): void,
}>()

const value = useModelValue(props, emit)
</script>

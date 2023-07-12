<template>
  <div class="row q-ml-lg q-gutter-sm">
    <div class="col-4">
      <q-select
        v-model="value.fieldId"
        :disable="disable"
        :options="schemaFields"
        label="Fieldname"
        options-dense
        clearable
        emit-value
        dense
        outlined
      />
    </div>

    <div class="col-2">
      <q-select
        v-model="value.op"
        :disable="disable"
        :options="operators"
        options-dense
        dense
        outlined
      />
    </div>

    <div class="col">
      <q-input
        v-model="value.value"
        label="Value"
        clearable
        dense
        outlined
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { QueryCriteria } from '@/shared/interfaces/query'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: QueryCriteria
  disable?: boolean
  fields: string[]
  operators: string[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryCriteria): void,
}>()

const value = useModelValue(props, emit)

const schemaFields = computed(() => ([]))
</script>

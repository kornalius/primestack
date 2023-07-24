<template>
  <div>
    <div class="row q-gutter-sm q-my-sm items-center">
      <div class="col-4">
        <q-input
          v-model="value.name"
          label="Schema name"
          input-class="text-bold"
          dense
          outlined
        />
      </div>

      <div class="col">
        <q-checkbox
          v-model="value.created"
          label="Created by and created at"
          dense
        />
      </div>

      <div class="col">
        <q-checkbox
          v-model="value.updated"
          label="Updated by and updated at"
          dense
        />
      </div>

      <div class="col">
        <q-checkbox
          v-model="value.softDelete"
          label="Soft delete"
          dense
        />
      </div>
    </div>

    <div class="row q-my-sm q-mb-md">
      <div class="col">
        <q-select
          v-model="value.methods"
          label="Supported methods"
          :options="['get', 'find', 'create', 'patch', 'remove']"
          multiple
          options-dense
          dense
          outlined
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { schema } from '@/shared/schemas/table'

type Schema = Static<typeof schema>

const props = defineProps<{
  modelValue: Schema
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Schema): void,
}>()

const value = useModelValue(props, emit)
</script>

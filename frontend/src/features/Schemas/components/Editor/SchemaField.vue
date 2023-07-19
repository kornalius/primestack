<template>
  <div class="row q-gutter-sm items-center">
    <div class="col-3">
      <q-input
        v-model="value.name"
        label="Fieldname"
        input-class="text-bold"
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
      >
        <template #option="{ opt, itemProps }">
          <q-item class="items-center" v-bind="itemProps">
            <q-item-section avatar>
              <q-icon :name="iconForType(opt)" size="xs" color="grey-7" />
            </q-item-section>

            {{ opt }}
          </q-item>
        </template>
      </q-select>
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
import { fieldSchema, supportedFieldTypes } from '@/shared/schemas/schema'
import { useSchema } from '@/composites/schema'

type SchemaField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: SchemaField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: SchemaField): void,
}>()

const value = useModelValue(props, emit)

const { iconForType } = useSchema()
</script>

<style scoped lang="sass">
.q-item__section--avatar
  min-width: unset
</style>

<template>
  <div class="row items-center q-gutter-sm">
    <div class="col-4">
      <q-select
        v-model="field.fieldId"
        :disable="disable"
        :options="fields"
        label="Fieldname"
        option-value="_id"
        option-label="name"
        options-dense
        clearable
        emit-value
        map-options
        dense
        outlined
      >
        <template #option="{ opt, itemProps }">
          <q-item class="items-center" v-bind="itemProps">
            <q-item-section avatar>
              <q-icon :name="iconForType(opt.type)" size="xs" color="grey-7" />
            </q-item-section>

            {{ opt.name }}
          </q-item>
        </template>
      </q-select>
    </div>

    <div class="col-2">
      <q-select
        v-if="showOps"
        v-model="field.op"
        :disable="disable"
        :options="operators"
        options-dense
        dense
        outlined
      />
    </div>

    <div class="col">
      <div v-if="showValue">
        <q-input
          v-if="fieldType === 'string'"
          v-model="field.value"
          label="Value"
          clearable
          dense
          outlined
        />

        <q-input
          v-else-if="fieldType === 'number'"
          v-model.number="field.value"
          type="number"
          label="Value"
          dense
          outlined
        />

        <q-checkbox
          v-else-if="fieldType === 'boolean'"
          v-model="field.value"
          dense
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Static, TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { QueryCriteria } from '@/shared/interfaces/query'
import { fieldSchema } from '@/shared/schemas/schema'
import { useSchema } from '@/composites/schema'

type FieldSchema = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: QueryCriteria
  disable?: boolean
  fields: FieldSchema[]
  operators: string[]
}>()

const { iconForType, defaultValueForSchema } = useSchema()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryCriteria): void,
}>()

const field = useModelValue(props, emit)

const selectedField = computed(() => (
  props.fields.find((f) => f._id === field.value.fieldId)
))

const fieldType = computed(() => selectedField.value?.type)

const showOps = computed(() => selectedField.value && fieldType.value !== 'boolean')

const showValue = computed(() => selectedField.value)

watch(() => field.value.fieldId, () => {
  field.value.value = defaultValueForSchema({ type: fieldType.value } as TSchema)
}, { immediate: true })
</script>

<style scoped lang="sass">
.q-item__section--avatar
  min-width: unset
</style>

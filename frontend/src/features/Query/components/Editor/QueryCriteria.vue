<template>
  <div class="row items-center q-gutter-sm">
    <div class="col-4">
      <table-field-select
        v-model="field.fieldId"
        :disable="disable"
        :fields="fields"
        label="Fieldname"
        options-dense
        clearable
        dense
        outlined
      />
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
import { tableFieldSchema } from '@/shared/schemas/table'
import { defaultValueForSchema } from '@/shared/schema'
import { QueryCriteria } from '@/shared/interfaces/query'
import TableFieldSelect from '@/features/Fields/components/TableFieldSelect.vue'

type TableFieldSchema = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: QueryCriteria
  disable?: boolean
  fields: TableFieldSchema[]
  operators: string[]
}>()

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
  if (!field.value.value) {
    field.value.value = defaultValueForSchema({ type: fieldType.value } as TSchema)
  }
}, { immediate: true })
</script>

<style scoped lang="sass">
.q-item__section--avatar
  min-width: unset
</style>

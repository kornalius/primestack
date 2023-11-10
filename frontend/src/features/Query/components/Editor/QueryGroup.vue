<template>
  <q-card class="q-my-sm" flat bordered>
    <div :class="['row', 'title', color]">
      <div class="col text-subtitle1">
        {{ label }}
      </div>
    </div>

    <q-card-section class="q-pa-sm">
      <div class="row">
        <div class="col">
          <array-editor
            v-model="value.criterias"
            add-button="end"
            :disable="disable"
            :add-function="addCriteria"
            :remove-function="removeCriteria"
            no-separator
          >
            <template #default="{ index }">
              <div class="row q-my-sm">
                <div class="col">
                  <query-criteria-editor
                    v-model="value.criterias[index]"
                    :disable="disable"
                    :fields="fields"
                    :operators="operators"
                  />
                </div>
              </div>

              <div
                v-if="index < value.criterias.length - 1"
                class="row"
              >
                <div class="col">
                  <query-logical-operators
                    v-model="value.criterias[index].logicOp"
                    :disable="disable"
                  />
                </div>
              </div>
            </template>
          </array-editor>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { Static } from '@feathersjs/typebox'
import { QueryCriteria, QueryGroup } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryCriteriaEditor from '@/features/Query/components/Editor/QueryCriteria.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'
import { tableFieldSchema } from '@/shared/schemas/table'

type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: QueryGroup
  disable?: boolean
  label: string
  color: string
  fields: TableField[]
  operators: string[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: QueryGroup): void,
}>()

const value = useModelValue(props, emit)

const addCriteria = () => {
  const criteria: QueryCriteria = {
    fieldId: undefined,
    op: '=',
    value: '',
    logicOp: 'and',
  }
  value.value.criterias.push(criteria)
}

const removeCriteria = (val: unknown, index: number): boolean => {
  value.value.criterias.splice(index, 1)
  return true
}

watch(value, () => {
  if (value.value.criterias.length === 0) {
    addCriteria()
  }
}, { immediate: true })

</script>

<style scoped lang="sass">
.title
  padding: 0 8px
  background: rgba(0, 0, 0, 0.12)
  border-radius: 0 !important

.label
  white-space: nowrap
  transform: rotate(-90deg)
</style>

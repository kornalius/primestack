<template>
  <q-card class="card q-ma-sm full-height" outlined>
    <div :class="['row', 'items-center', 'title', `bg-${color}`]">
      <div class="col label">
        {{ label }}
      </div>
    </div>

    <q-card-section>
      <div class="row">
        <div class="col">
          <array-editor
            v-model="value.criterias"
            add-button="bottom"
            :disable="disable"
            :add-function="addCriteria"
            :remove-function="removeCriteria"
          >
            <template #default="{ index }">
              <query-logical-operators
                v-if="!!index"
                v-model="value.criterias[index].logicOp"
                :disable="disable"
              />

              <query-criteria-editor
                v-model="value.criterias[index]"
                :disable="disable"
                :fields="fields"
                :operators="operators"
              />
            </template>
          </array-editor>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { QueryCriteria, QueryGroup } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryCriteriaEditor from '@/features/Query/components/Editor/QueryCriteria.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'

const props = defineProps<{
  modelValue: QueryGroup
  disable?: boolean
  label: string
  color: string
  fields: string[]
  operators: string[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryGroup): void,
}>()

const value = useModelValue(props, emit)

const addCriteria = () => {
  const criteria: QueryCriteria = {
    fieldId: undefined,
    op: '===',
    value: '',
    logicOp: 'and',
  }
  value.value.criterias.push(criteria)
}

const removeCriteria = (val: unknown, index: number): boolean => {
  value.value.criterias.splice(index, 1)
  return true
}
</script>

<style scoped lang="sass">
.card
  position: relative
  min-height: 6rem

.title
  position: absolute
  left: 0
  bottom: 0
  background: rgba(0, 0, 0, 0.12)
  width: 2em
  height: 100%
  border-radius: 0 !important

.label
  white-space: nowrap
  transform: rotate(-90deg)
</style>

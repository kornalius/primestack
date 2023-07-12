<template>
  <array-editor
    v-model="value"
    add-button="bottom"
    :disable="disable"
    :add-function="addGroup"
    :remove-function="removeGroup"
  >
    <template #default="{ index }">
      <div class="row">
        <div class="col">
          <query-logical-operators
            v-if="!!index"
            v-model="value[index].logicOp"
            :disable="disable"
            color="negative"
          />
        </div>
      </div>

      <div class="row">
        <div class="col">
          <query-group-editor
            v-model="value[index]"
            :label="`Group ${index + 1}`"
            :disable="disable"
            :color="palette[index % palette.length]"
            :fields="fields"
            :operators="queryOperators"
          />
        </div>
      </div>
    </template>
  </array-editor>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelValue } from '@/composites/prop'
import { Query, QueryGroup, queryOperators } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryGroupEditor from '@/features/Query/components/Editor/QueryGroup.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'

const props = defineProps<{
  modelValue: Query
  fields: string[]
  disable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Query): void,
}>()

const palette = ref([
  'bg-blue-5',
  'bg-green-5',
  'bg-grey-5',
  'bg-purple-5',
  'bg-orange-5',
  'bg-teal-5',
  'bg-pink-5',
])

const value = useModelValue(props, emit)

const addGroup = () => {
  const group: QueryGroup = {
    criterias: [],
    logicOp: 'and',
  }
  value.value.push(group)
}

const removeGroup = (val: unknown, index: number): boolean => {
  value.value.splice(index, 1)
  return true
}
</script>

<template>
  <div class="row">
    <div class="col">
      <q-select
        v-model="query.schemaId"
        :loading="isPending"
        :options="schemas"
        label="Select a schema..."
        option-value="_id"
        option-label="name"
        options-dense
        emit-value
        map-options
        dense
        outlined
      />
    </div>
  </div>

  <array-editor
    v-model="query.groups"
    add-button="end"
    :disable="disable || !query.schemaId"
    :add-function="addGroup"
    :remove-function="removeGroup"
    no-separator
  >
    <template #default="{ index }">
      <div class="row">
        <div class="col">
          <query-group-editor
            v-model="query.groups[index]"
            :label="`Group ${index + 1}`"
            :disable="disable || !query.schemaId"
            :color="palette[index % palette.length]"
            :fields="fields"
            :operators="queryOperators"
          />
        </div>
      </div>

      <div class="row">
        <div class="col q-ml-sm">
          <query-logical-operators
            v-if="index < query.groups.length - 1"
            v-model="query.groups[index].logicOp"
            :disable="disable || !query.schemaId"
            color="negative"
          />
        </div>
      </div>
    </template>
  </array-editor>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { Query, QueryGroup, queryOperators } from '@/shared/interfaces/query'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryGroupEditor from '@/features/Query/components/Editor/QueryGroup.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'
import { api } from '@/plugins/pinia'

const props = defineProps<{
  modelValue: Query
  disable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Query): void,
}>()

const palette = ref([
  'bg-purple-1',
  'bg-green-1',
  'bg-blue-1',
  'bg-grey-1',
  'bg-orange-1',
  'bg-teal-1',
  'bg-pink-1',
])

const query = useModelValue(props, emit)

const addGroup = () => {
  const group: QueryGroup = {
    criterias: [],
    logicOp: 'and',
  }
  query.value.groups.push(group)
}

const removeGroup = (val: unknown, index: number): boolean => {
  query.value.groups.splice(index, 1)
  return true
}

watch(query, () => {
  if (query.value.groups.length === 0) {
    addGroup()
  }
}, { immediate: true })

/**
 * Schemas
 */

const { data: schemas, isPending, find } = api.service('schemas').useFind({
  query: {},
})
find()

const fields = computed(() => {
  if (query.value.schemaId) {
    const schema = api.service('schemas').getFromStore(query.value.schemaId)
    if (schema.value) {
      return schema.value.fields
    }
  }
  return []
})

watch(() => query.value.schemaId, () => {
  query.value.groups = []
  addGroup()
})
</script>

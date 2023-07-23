<template>
  <div v-bind="$attrs">
    <div
      v-if="!hideSchema"
      class="row q-ma-sm"
    >
      <div class="col">
        <schema-select
          v-model="currentSchemaId"
          label="Select a schema..."
          options-dense
          dense
          outlined
        />
      </div>
    </div>

    <array-editor
      v-model="query.groups"
      add-button="end"
      :disable="disable || !currentSchemaId"
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
              :disable="disable || !currentSchemaId"
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
              :disable="disable || !currentSchemaId"
              color="negative"
            />
          </div>
        </div>
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { Query, QueryGroup, queryOperators } from '@/shared/interfaces/query'
import { useFeathers } from '@/composites/feathers'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryGroupEditor from '@/features/Query/components/Editor/QueryGroup.vue'
import QueryLogicalOperators from '@/features/Query/components/Editor/QueryLogicalOperators.vue'
import SchemaSelect from '@/features/Fields/components/SchemaSelect.vue'

const props = defineProps<{
  modelValue: Query
  // override the query schemaId
  schemaId?: string
  disable?: boolean
  // hide the schema selector
  hideSchema?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:schemaId', value: string): void,
  (e: 'update:model-value', value: Query): void,
}>()

const { api } = useFeathers()

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

const currentSchemaId = useSyncedProp(props, 'schemaId', emit)

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
  if (!Array.isArray(query.value.groups)) {
    query.value.groups = []
  }
  if (query.value.groups.length === 0) {
    addGroup()
  }
}, { immediate: true })

watch(() => props.schemaId, () => {
  if (props.schemaId) {
    query.value.schemaId = props.schemaId
  }
}, { immediate: true })

watch(currentSchemaId, () => {
  query.value.schemaId = currentSchemaId.value
})

/**
 * Schemas
 */

const { data: schemas } = api.service('schemas').useFind({
  query: {},
})

const userSchema = computed(() => schemas.value?.[0])

const querySchema = computed(() => (
  userSchema.value?.list.find((s) => s._id === query.value.schemaId)
))

const fields = computed(() => querySchema.value?.fields || [])

watch(() => query.value.schemaId, () => {
  query.value.groups = []
  addGroup()
})
</script>

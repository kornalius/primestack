<template>
  <div>
    <div class="row">
      <div class="col-auto">
        into table:
      </div>
      <div class="col-auto text-bold q-ml-xs text-italic">
        {{ tableName }}
      </div>
    </div>

    <div class="row">
      <div class="col">
        Query:
      </div>
    </div>

    <div class="row">
      <div class="col">
        <property-highlight
          :model-value="queryValue"
          language="basic"
        />
      </div>
    </div>

    <div class="row">
      <div class="col">
        Patch Data:
      </div>
    </div>

    <div class="row">
      <div class="col">
        <property-highlight
          :model-value="fields"
          language="json"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import hljs from 'highlight.js'
import json from 'highlight.js/lib/languages/json'
// eslint-disable-next-line import/no-cycle
import { useActions } from '@/features/Actions/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathers } from '@/composites/feathers'
import { useExpression } from '@/features/Expression/composites'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'
import { useQuery } from '@/features/Query/composites'

hljs.registerLanguage('json', json)

const props = defineProps<{
  modelValue: AnyData
}>()

const { fieldsArrayToObject } = useActions()

const { api } = useFeathers()

const { data: tables } = api.service('tables').useFind({ query: {} })

const userTable = computed(() => tables.value?.[0])

const tableName = computed(() => (
  userTable.value.list.find((t) => t._id === props.modelValue.tableId)?.name
))

const { buildCtx } = useExpression()

const ctx = buildCtx()

const { queryToString } = useQuery()

/**
 * Computes the user's table instance
 */
const table = computed(() => (
  userTable.value.list.find((t) => t._id === props.modelValue.tableId)
))

/**
 * Computes the query value as a string
 */
const queryValue = computed((): string => (
  queryToString(props.modelValue.query || { limit: 10, skip: 0, groups: [] }, table.value) || '()'
))

/**
 * Computes the fields to patch
 */
const fields = computed(() => (
  JSON.stringify(
    fieldsArrayToObject(props.modelValue.fields as [], ctx),
    undefined,
    2,
  )
))
</script>
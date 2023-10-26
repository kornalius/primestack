<template>
  <div>
    <div class="row">
      <div class="col-auto text-bold">
        Patch
      </div>
      <div class="col-auto q-ml-xs">
        into table
      </div>
      <div class="col-auto q-ml-xs text-weight-medium text-italic">
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
import { useI18n } from 'vue-i18n'
// eslint-disable-next-line import/no-cycle
import { useActions } from '@/features/Actions/composites'
import { useFeathersService } from '@/composites/feathers'
import { useExpression } from '@/features/Expression/composites'
import { useQuery } from '@/features/Query/composites'
import { AnyData } from '@/shared/interfaces/commons'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

hljs.registerLanguage('json', json)

const props = defineProps<{
  modelValue: AnyData
}>()

const { fieldsArrayToObject } = useActions()

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const { queryToString } = useQuery()

/**
 * Computes the user's table instance
 */
const table = computed(() => (
  userTable.value?.list.find((tbl) => tbl._id === props.modelValue.tableId)
))

const tableName = computed(() => table.value?.name)

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

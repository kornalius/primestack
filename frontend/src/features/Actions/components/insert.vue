<template>
  <div>
    <div class="row">
      <div class="col-auto text-bold">
        Insert
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
import { AnyData } from '@/shared/interfaces/commons'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

hljs.registerLanguage('json', json)

const props = defineProps<{
  modelValue: AnyData
}>()

const { fieldsArrayToObject } = useActions()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const { data: tables } = useFeathersService('tables')
  .useFind(computed(() => ({ query: {} })))

const userTable = computed(() => tables.value?.[0])

const tableName = computed(() => (
  userTable.value.list.find((tbl) => tbl._id === props.modelValue.tableId)?.name
))

/**
 * Computes the fields to insert
 */
const fields = computed(() => (
  JSON.stringify(
    fieldsArrayToObject(props.modelValue.fields as [], ctx),
    undefined,
    2,
  )
))
</script>

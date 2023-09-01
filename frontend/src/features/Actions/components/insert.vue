<template>
  <div>
    <div class="row">
      <div class="col-auto text-bold">
        into table:
      </div>
      <div class="col-auto q-ml-xs text-italic">
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
// eslint-disable-next-line import/no-cycle
import { useActions } from '@/features/Actions/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathers } from '@/composites/feathers'
import { useExpression } from '@/features/Expression/composites'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

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

const fields = computed(() => (
  JSON.stringify(
    fieldsArrayToObject(props.modelValue.fields as [], ctx()),
    undefined,
    2,
  )
))
</script>

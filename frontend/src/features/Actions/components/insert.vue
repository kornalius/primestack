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
        <pre
          class="q-my-none"
          v-html="hljs.highlight(fields, { language: 'json' }).value"
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

const fields = computed(() => (
  JSON.stringify(fieldsArrayToObject(props.modelValue.fields as []), undefined, 2)
))
</script>

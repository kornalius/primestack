<template>
  <div v-if="value">
    <q-virtual-scroll
      v-if="(field as any).virtualScroll"
      v-bind="fieldBinds(field, schemaForField(field), ctx)"
      :style="style(field)"
      :items="list"
      :virtual-scroll-horizontal="horizontal"
      v-slot="{ item, index }"
    >
      <q-linear-progress
        v-if="isLoading"
        indeterminate
      />

      <form-display
        :model-value="objectItem(item, index)"
        :fields="fields"
      />
    </q-virtual-scroll>

    <div
      v-else
      v-bind="fieldBinds(field, schemaForField(field), ctx)"
      :style="style(field)"
      style="overflow: auto;"
    >
      <q-linear-progress
        v-if="isLoading"
        indeterminate
      />

      <div
        v-for="(item, index) in list"
        :key="index"
        :style="{ display: horizontal ? 'inline-block' : undefined }"
      >
        <form-display
          :model-value="objectItem(item, index)"
          :fields="fields"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { columnSchema, fieldSchema } from '@/shared/schemas/form'
import { tableSchema } from '@/shared/schemas/table'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathersService } from '@/composites/feathers'
import { queryToMongo } from '@/features/Query/composites'
import { Query } from '@/shared/interfaces/query'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type Table = Static<typeof tableSchema>

const props = defineProps<{
  modelValue: unknown[] | undefined
  field: FormField
  columns: FormColumn[]
  horizontal?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, style, schemaForField } = useFormElements()

const { t } = useI18n()

const {
  buildCtx,
  isExpr,
  exprCode,
  runExpr,
} = useExpression(t)

const ctx = buildCtx()

const fields = computed((): FormField[] => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns[0]._fields as FormField[]
))

const list = ref([])

const isLoading = ref(false)

watch(() => props.field, () => {
  const field = props.field as AnyData

  // expression
  const expr = field.loopExpr
  if (expr && isExpr(expr)) {
    const v = runExpr(exprCode(expr), ctx) as unknown[]
    if (typeof v === 'number') {
      list.value = new Array(v).fill(undefined)
    } else {
      list.value = v
    }
  } else if (field.tableId) {
    // tableId with optional query
    const userTable = useFeathersService('tables').findOneInStore({ query: {} })
    const table = userTable.value?.list.find((tbl: Table) => tbl._id === field.tableId)
    if (table) {
      const q = field.query ? queryToMongo(field.query as Query, table, ctx.$expr) : {}
      const find = useFeathersService(field.tableId).useFind(computed(() => ({ query: q })))
      watch(find.data, () => {
        list.value = find.data.value
      })
      watch(find.isPending, () => {
        isLoading.value = find.isPending.value
      })
    }
  }
}, { immediate: true, deep: true })

const objectItem = (item: unknown, index: number): Record<string, unknown> => {
  if (typeof item === 'object' && !Array.isArray(item)) {
    return {
      ...item as Record<string, unknown>,
      index,
    }
  }
  return { value: item, index }
}
</script>

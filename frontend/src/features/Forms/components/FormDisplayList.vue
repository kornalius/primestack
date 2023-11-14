<template>
  <div v-if="value">
    <q-virtual-scroll
      v-if="(field as any).virtualScroll"
      :class="{
        ...objectValue(component?.classes || {}, field),
        ...classBinds(field),
      }"
      :style="{
        ...objectValue(component?.styles || {}, field),
        ...styleBinds(field),
      }"
      v-bind="fieldBinds(field, schemaForField(field), ctx)"
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
      :class="{
        ...objectValue(component?.classes || {}, field),
        ...classBinds(field),
      }"
      :style="{
        overflow: 'auto',
        ...objectValue(component?.styles || {}, field),
        ...styleBinds(field),
      }"
      v-bind="fieldBinds(field, schemaForField(field), ctx)"
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
import { objectValue } from '@/composites/utilities'
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

const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const {
  componentsByType,
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
} = useFormElements()

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
  props.columns?.[0]?._fields as FormField[] || []
))

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[props.field._type]
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
  // if it's an object, expand it
  if (typeof item === 'object' && !Array.isArray(item)) {
    return {
      _index: index,
      ...value.value,
      ...item as Record<string, unknown>,
    }
  }

  // if considered primitive, return as _value
  return {
    _value: item,
    _index: index,
    ...value.value,
  }
}
</script>

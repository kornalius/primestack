<template>
  <columns-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    :columns="columns"
    :value-field="valueField"
    :label-field="labelField"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </columns-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useFeathersService } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'
import { Column } from '@/features/Fields/interfaces'
import ColumnsSelect from '@/features/Fields/components/ColumnsSelect.vue'

const props = defineProps<{
  modelValue: string | null | undefined
  tableId: string
  query?: AnyData
  valueField: string
  labelField: string
  columns: Column[]
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const data = ref()

const options = computed(() => (
  (data.value || []).map((d: AnyData) => (
    props.columns.reduce((acc, col) => ({
      ...acc,
      [col.field]: d[col.field],
    }), {})
  ))
))

const params = computed(() => ({
  query: {
    ...(props.query || {}),
    $limit: -1,
    $skip: 0,
  },
}))

watch(() => props.tableId, () => {
  if (props.tableId) {
    const { data: rows, find } = useFeathersService(props.tableId)
      .useFind(params)
    find(params.value)
    watch(rows, () => {
      data.value = rows.value
    }, { immediate: true })
  }
}, { immediate: true })
</script>

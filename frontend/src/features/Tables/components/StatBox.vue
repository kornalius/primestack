<template>
  <value-box
    :model-value="v"
    v-bind="$attrs"
    :value-format="format"
    :value-digits="digits"
    :label="displayLabel"
    :diff="diff"
    :diff-icon="diffIcon"
    :diff-digits="2"
    diff-format="percent"
  />
</template>

<script setup lang="ts">
import {
  computed, watch, useAttrs, ref,
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useStats } from '@/features/Stats/store'
import { AnyData } from '@/shared/interfaces/commons'
import ValueBox from '@/features/Fields/components/ValueBox.vue'

const props = defineProps<{
  type: 'count' | 'avg' | 'sum' | 'min' | 'max' | 'empty' | '!empty' | '%empty' | '%!empty'
  tableId: string
  field?: string
  query?: AnyData
  groupFields?: string[]
}>()

const attrs = useAttrs()

const stats = useStats()

const { t } = useI18n()

const stat = ref()
const pv = ref()

const v = computed(() => stat.value?.value?.value || 0)

watch([
  () => props.type,
  () => props.tableId,
  () => props.field,
  () => props.query,
  () => props.groupFields,
], () => {
  if (props.tableId) {
    stat.value = stats.newStat({
      tableId: props.tableId,
      query: props.query,
      type: props.type,
      field: props.field,
      groupFields: props.groupFields,
    })
  }
}, { immediate: true })

watch(v, (n, o) => {
  pv.value = o
}, { deep: true })

const displayLabel = computed(() => {
  if (attrs.label) {
    return attrs.label as string
  }

  switch (props.type) {
    case 'count': return t('stats.labels.count', { field: props.field })
    case 'avg': return t('stats.labels.avg', { field: props.field })
    case 'sum': return t('stats.labels.sum', { field: props.field })
    case 'min': return t('stats.labels.min', { field: props.field })
    case 'max': return t('stats.labels.max', { field: props.field })
    case 'empty': return t('stats.labels.empty', { field: props.field })
    case '!empty': return t('stats.labels.notEmpty', { field: props.field })
    case '%empty': return t('stats.labels.pctEmpty', { field: props.field })
    case '%!empty': return t('stats.labels.pctNotempty', { field: props.field })
    default: return ''
  }
})

const diffIcon = computed(() => {
  const d = v.value - pv.value
  if (d > 0) {
    return 'mdi-chevron-up'
  }
  if (d < 0) {
    return 'mdi-chevron-down'
  }
  return ''
})

const format = computed(() => (
  (attrs.valueFormat as string)
    || (['%empty', '%!empty'].includes(props.type) ? 'percent' : 'decimal')
))

const digits = computed(() => (
  attrs.valueDigits as number || (['%empty', '%!empty'].includes(props.type) ? 2 : 0)
))

const diff = computed(() => {
  const r = pv.value / v.value
  if (!Number.isFinite(r) || Number.isNaN(r) || pv.value === v.value) {
    return undefined
  }
  return 1 - r
})
</script>

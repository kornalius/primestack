<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    :loading="isPending"
    new-value-mode="add-unique"
    autocomplete="label"
    emit-value
    map-options
    use-input
    @new-value="newValue"
  >
    <template v-for="(_, slot) in $slots" #[slot]="scope">
      <slot :name="slot" v-bind="scope || {}" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-select>
</template>

<script setup lang="ts">
import {
  computed, onBeforeUnmount, ref, watch,
} from 'vue'
import { useModelValue } from '@/composites/prop'
import { useFeathersService } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: string | undefined | string[]
  tableId: string
  field: string
  query?: AnyData
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined | string[]): void,
  (e: 'new-value', value: string): void,
}>()

const value = useModelValue(props, emit)

const data = ref()

const isPending = ref(false)

const options = computed(() => (
  (data.value || []).reduce((acc, d: AnyData) => {
    const v = d[props.field]
    if (Array.isArray(v)) {
      return [
        ...acc,
        ...v.map((i) => ({ label: i, value: i })),
      ]
    }
    return [
      ...acc,
      { label: v, value: v },
    ]
  }, [])
))

const params = computed(() => ({
  query: {
    ...(props.query || {}),
    $limit: -1,
    $skip: 0,
  },
}))

let cancelRows = () => {}
let cancelIsPending = () => {}

watch([() => props.tableId, () => props.field], () => {
  cancelRows()
  cancelRows = () => {}

  cancelIsPending()
  cancelIsPending = () => {}

  if (props.tableId && props.field) {
    const { data: rows, pending, find } = useFeathersService(props.tableId)
      .useFind(params)
    find(params.value)

    cancelRows = watch(rows, () => {
      data.value = rows.value
    }, { immediate: true })

    cancelIsPending = watch(pending, () => {
      isPending.value = pending.value
    }, { immediate: true })
  }
}, { immediate: true })

const newValue = (v: string, doneFn: ((item: string, mode?: string) => void)) => {
  if (!options.value.find((o) => o.value === v)) {
    options.value.push({
      label: v,
      value: v,
    })
  }
  doneFn(v)
  emit('new-value', v)
}

onBeforeUnmount(() => {
  cancelRows()
  cancelIsPending()
})
</script>

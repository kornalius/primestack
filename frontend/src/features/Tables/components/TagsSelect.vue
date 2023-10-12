<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="options"
    new-value-mode="add-unique"
    autocomplete="label"
    emit-value
    map-options
    use-input
    @new-value="newValue"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useFeathersService } from '@/composites/feathers'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: string | undefined | string[]
  tableId: string
  field: string
  query?: AnyData
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined | string[]): void,
  (e: 'new-value', value: string): void,
}>()

const value = useModelValue(props, emit)

const options = ref([])

watch([() => props.tableId, () => props.field], () => {
  if (props.tableId && props.field) {
    const { data, find } = useFeathersService(props.tableId)
      .useFind(computed(() => ({ query: props.query || {} })))
    find({ query: props.query })
    watch(data, () => {
      options.value = data.value.reduce((acc, d: AnyData) => {
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
</script>

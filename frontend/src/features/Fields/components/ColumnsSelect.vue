<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="filteredOptions"
    :option-label="primaryLabel"
    :option-value="primaryField"
    :virtual-scroll-item-size="32"
    use-input
    emit-value
    map-options
    @filter="filter"
  >
    <template #before-options>
      <q-item class="items-center" dense>
        <q-item-section>
          <div class="row">
            <div
              v-for="col in columns"
              :key="col.field"
              class="title column"
              :class="colClass(col, true)"
              :style="col.titleStyle"
            >
              {{ col.title || startCase(col.field) }}
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>

    <template #option="{ opt, itemProps }">
      <q-item class="items-center" v-bind="itemProps">
        <q-item-section>
          <div class="row">
            <div
              v-for="col in columns"
              :key="col.field"
              class="column"
              :class="colClass(col)"
              :style="col.style"
            >
              {{ opt[col.field] }}
            </div>
          </div>
        </q-item-section>
      </q-item>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { QSelect } from 'quasar'
import startCase from 'lodash/startCase'
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { Column } from '@/features/Fields/interfaces'

const props = defineProps<{
  modelValue: string | null | undefined
  options: AnyData[]
  valueField?: string
  labelField?: string
  columns: Column[]
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const colClass = (col: Column, title = false): string | string[] | AnyData => {
  const c = col.size > 0
    ? `col-${col.size}`
    : 'col'
  const cls = title ? col.titleClass : col.class
  if (Array.isArray(cls)) {
    return [c, ...cls]
  }
  if (typeof cls === 'object') {
    return {
      [c]: true,
      ...cls,
    }
  }
  return [c, cls].join(' ')
}

const primaryField = computed(() => (
  props.valueField || props.columns?.[0]?.field
))

const primaryLabel = computed(() => (
  props.labelField || props.columns?.[0]?.field || primaryField.value
))

const filteredOptions = ref([])

watch(() => props.options, () => {
  filteredOptions.value = props.options
}, { immediate: true })

const filter = (
  inputValue: string,
  doneFn: (callbackFn: () => void, afterFn?: (ref: QSelect) => void) => void,
) => {
  const val = inputValue?.toLowerCase().trim()
  doneFn(() => {
    if (!val || val === '') {
      filteredOptions.value = props.options
    } else {
      const cols = (props.columns || []).filter((col) => col.filterable)
      filteredOptions.value = props.options.filter((row) => (
        !!cols.find((col) => row[col.field]?.toString().toLowerCase().indexOf(val) !== -1)
      ))
    }
  })
}
</script>

<style scoped lang="sass">
</style>

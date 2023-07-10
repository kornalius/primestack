<template>
  <q-select
    v-model="value"
    v-bind="$attrs"
    :options="displayedOptions"
    :option-value="optionValue"
    :input-debounce="0"
    dense
    outlined
    options-dense
    map-options
    emit-value
    clearable
    @filter="filterFn"
  >
    <template #no-option>
      <q-item>
        <q-item-section class="text-grey">
          No results
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  optionValue?: ((option: string | any) => any) | string;
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: any): void,
}>()

const value = useModelValue(props, emit)
const displayedOptions = ref([])

const getValue = (v) => {
  const ov = props.optionValue
  if (ov) {
    let k = ov
    if (typeof ov === 'function') {
      k = ov(v)
    }
    return v[k]
  }
  return v
}

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      displayedOptions.value = props.options
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    displayedOptions.value = props.options
      .filter((v) => getValue(v).toLowerCase().indexOf(needle) > -1)
  })
}
</script>

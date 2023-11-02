<template>
  <div
    v-if="spread"
    class="row"
  >
    <div
      v-for="option in $attrs.options"
      :key="option.label"
      class="col"
    >
      <q-btn-toggle
        v-bind="$attrs"
        v-model="value[option.value]"
        :options="[option]"
        :clearable="clearable"
        :disable="disable"
        spread
        stretch
        unelevated
        dense
      />
    </div>
  </div>

  <div v-else>
    <q-btn-toggle
      v-for="option in $attrs.options"
      :key="option.label"
      v-bind="$attrs"
      v-model="value[option.value]"
      class="inline"
      :options="[option]"
      :clearable="clearable"
      :disable="disable"
      spread
      stretch
      unelevated
      dense
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: Record<string, string>
  spread?: boolean
  clearable?: boolean
  disable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, string>): void,
}>()

const value = useModelValue(props, emit)

watch(value, () => {
  if (typeof value.value !== 'object') {
    value.value = {}
  } else if (typeof value.value === 'string') {
    value.value = { [value.value]: value.value }
  }
}, { immediate: true })
</script>

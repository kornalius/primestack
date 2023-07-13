<template>
  <div class="row">
    <div class="col">
      <q-option-group
        v-model="value"
        class="text-caption"
        :options="options"
        dense
        inline
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { QueryLogicalOp } from '@/shared/interfaces/query'
import { computed } from 'vue'

const props = defineProps<{
  modelValue: QueryLogicalOp
  disable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryLogicalOp): void,
}>()

const value = useModelValue(props, emit)

const options = computed(() => ([
  {
    label: 'And',
    value: 'and',
  },
  {
    label: 'Or',
    value: 'or',
  },
]))
</script>

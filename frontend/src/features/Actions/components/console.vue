<template>
  <div>
    <div class="row q-py-md" style="background-color: #333; border-radius: 4px;">
      <div
        class="col q-px-xs"
        :style="style"
      >
        {{ exprToString(modelValue.message) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'

const props = defineProps<{
  modelValue: AnyData
}>()

const color = computed(() => {
  switch (props.modelValue?.type) {
    case 'log': return '#eee'
    case 'info': return '#99c0ff'
    case 'warn': return 'orange'
    case 'error': return '#ff4f4f'
    default: return '#eee'
  }
})

const backgroundColor = computed(() => {
  switch (props.modelValue?.type) {
    case 'log': return '#333'
    case 'info': return '#222d4d'
    case 'warn': return '#4e3000'
    case 'error': return '#500000'
    default: return '#333'
  }
})

const style = computed(() => ({
  fontFamily: 'monospace',
  backgroundColor: backgroundColor.value,
  borderTop: `1px solid ${color.value}`,
  borderBottom: `1px solid ${color.value}`,
  color: color.value,
}))
</script>

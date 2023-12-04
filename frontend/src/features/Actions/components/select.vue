<template>
  <div class="row items-center">
    <div class="col-auto text-bold">
      {{ $t('actions.select.label') }}
    </div>

    <div v-if="modelValue.rows" class="col-auto q-ml-xs text-italic">
      {{ exprToString(modelValue.rows) }}
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'

defineProps<{
  modelValue: unknown
}>()
</script>

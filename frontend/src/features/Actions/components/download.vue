<template>
  <div class="row items-center">
    <div class="col-auto text-italic">
      {{ $t('actions.download.from') }}
    </div>

    <div class="col-auto q-ml-xs text-weight-medium">
      {{ exprToString(modelValue.href) }}
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

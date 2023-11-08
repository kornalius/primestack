<template>
  <div class="row items-center">
    <div class="col-auto text-bold">
      {{ $t('actions.setsetting.label') }}
    </div>

    <div v-if="modelValue.name" class="col-auto text-weight-medium">
      <span class="q-chip q-chip--dense">{{ modelValue.name }}</span>
    </div>

    <div v-if="modelValue.value" class="col-auto">
      {{ $t('actions.setsetting.to') }}
    </div>

    <div v-if="modelValue.value" class="col-auto q-ml-xs text-italic">
      {{ exprToString(modelValue.value) }}
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

<template>
  <div
    class="row items-center q-banner"
    :class="snacks.snackClass(modelValue as any)"
  >
    <div class="col q-banner__content col text-body2">
      {{ exprToString(modelValue.message) }}
    </div>

    <div class="col-auto">
      <q-btn flat disable dense>
        {{ $t('buttons.dismiss') }}
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'
import { useSnacks } from '@/features/Snacks/store'

const snacks = useSnacks()

defineProps<{
  modelValue: { level: string, message: string }
}>()
</script>

<template>
  <div class="q-mb-sm q-mr-sm">
    <div class="row items-center">
      <div class="col-auto text-bold">
        {{ $t('actions.if.label') }}
      </div>

      <div class="col q-ml-xs">
        <property-highlight
          :model-value="exprCode(modelValue.expr)"
          language="javascript"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exprCode } from '@/features/Expression/composites'

defineProps<{
  modelValue: AnyData
}>()
</script>

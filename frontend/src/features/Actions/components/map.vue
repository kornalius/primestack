<template>
  <div class="q-mb-sm q-mr-sm">
    <div class="row items-center">
      <div class="col-auto text-bold">
        {{ $t('actions.map.label') }}
      </div>
    </div>

    <div class="row items-center">
      <div class="col">
        <property-highlight
          :model-value="value"
          language="json"
        />
      </div>
    </div>

    <div class="row items-center">
      <div class="col">
        {{ $t('actions.map.with') }}
      </div>
    </div>

    <div class="row items-center">
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
import { computed } from 'vue'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exprCode } from '@/features/Expression/composites'

const props = defineProps<{
  modelValue: AnyData
}>()

const value = computed(() => (
  JSON.stringify(
    props.modelValue.value || {},
    undefined,
    2,
  )
))
</script>

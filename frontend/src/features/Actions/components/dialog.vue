<template>
  <div class="q-mb-sm q-mr-sm">
    <div class="row">
      <div class="col text-h6">
        {{ exprToString(modelValue.title) }}
      </div>
    </div>
    <div class="row q-mb-sm">
      <div class="col-auto">
        {{ exprToString(modelValue.message) }}
      </div>
    </div>

    <div class="row items-center justify-end q-gutter-sm">
      <div class="col-auto">
        <q-btn
          v-bind="modelValue.cancel"
          :label="exprToString(modelValue.cancel.label) || 'Cancel'"
          disable
        />
      </div>
      <div class="col-auto">
        <q-btn
          v-bind="modelValue.ok"
          :label="exprToString(modelValue.ok.label) || 'Ok'"
          disable
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { exprToString } from '@/features/Expression/composites'

defineProps<{
  modelValue: AnyData
}>()
</script>

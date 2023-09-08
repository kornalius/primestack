<template>
  <div class="q-mb-sm q-mr-sm">
    <div class="row">
      <div class="col text-h6">
        {{ modelValue.title }}
      </div>
    </div>
    <div class="row q-mb-sm">
      <div class="col-auto">
        {{ modelValue.message }}
      </div>
    </div>

    <div class="row items-center justify-end q-gutter-sm">
      <div class="col-auto">
        <q-btn
          v-bind="modelValue.cancel"
          :label="modelValue.cancel.label || 'Cancel'"
          disable
        />
      </div>
      <div class="col-auto">
        <q-btn
          v-bind="modelValue.ok"
          :label="modelValue.ok.label || 'Ok'"
          disable
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

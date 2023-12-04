<template>
  <div class="row items-center">
    <div v-if="modelValue.name" class="col-auto text-bold">
      {{ $t('actions.getselected.label') }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

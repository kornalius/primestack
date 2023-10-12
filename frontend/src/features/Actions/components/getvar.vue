<template>
  <div class="row items-center">
    <div v-if="modelValue.name" class="col-auto text-bold">
      Get
    </div>

    <div v-if="modelValue.name" class="col-auto text-weight-medium">
      <span class="q-chip q-chip--dense">{{ modelValue.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

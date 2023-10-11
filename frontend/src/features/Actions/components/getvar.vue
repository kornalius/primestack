<template>
  <div class="row items-center">
    <div v-if="modelValue.name" class="col-auto text-italic">
      get
    </div>

    <div v-if="modelValue.name" class="col-auto q-ml-xs text-bold">
      {{ modelValue.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

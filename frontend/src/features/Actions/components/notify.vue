<template>
  <div class="row items-center">
    <div class="col-auto text-italic">
      {{ modelValue.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: { level: string, message: string }
}>()
</script>

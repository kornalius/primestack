<template>
  <div class="row items-center">
    <div class="col-auto text-bold">
      title:
    </div>
    <div class="col-auto q-ml-xs text-italic">
      {{ modelValue.title }}
    </div>
    <div class="col-auto q-ml-sm text-bold">
      message:
    </div>
    <div class="col-auto q-ml-xs text-italic">
      {{ modelValue.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

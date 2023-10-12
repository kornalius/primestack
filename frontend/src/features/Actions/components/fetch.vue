<template>
  <div class="row items-center">
    <div class="col-auto text-italic">
      from
    </div>

    <div class="col-auto q-ml-xs text-bold">
      {{ modelValue.href }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

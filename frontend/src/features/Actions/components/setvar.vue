<template>
  <div class="row items-center">
    <div v-if="modelValue.name" class="col-auto text-italic">
      set
    </div>
    <div v-if="modelValue.name" class="col-auto q-ml-xs text-bold">
      {{ modelValue.name }}
    </div>
    <div v-if="modelValue.value" class="col-auto q-ml-sm text-italic">
      to
    </div>
    <div v-if="modelValue.value" class="col-auto q-ml-xs text-bold">
      {{ modelValue.value }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: unknown
}>()
</script>

<template>
  <q-item class="bg-grey-4 items-center" dense>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-label>
      {{ title }}
    </q-item-label>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
}>()
</script>

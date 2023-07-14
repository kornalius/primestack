<template>
  <q-item class="bg-grey-4 items-center q-mb-md" dense>
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

<style scoped lang="sass">
</style>

<template>
  <q-item
    class="bg-grey-4 items-center"
    :class="`bg-${color}`"
    dense
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="grey-8" />
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
  color?: string
}>()
</script>

<style scoped lang="sass">
.q-item__section--avatar
  min-width: unset
  padding-right: 4px
</style>

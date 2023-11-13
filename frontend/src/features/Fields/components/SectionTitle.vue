<template>
  <q-item
    class="bg-grey-4 items-center"
    :class="`bg-${color}`"
    style="height: 40px;"
    dense
  >
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" color="grey-8" />
    </q-item-section>

    <q-item-label>
      <slot name="title-before" />

      <slot name="title">
        {{ title }}
      </slot>

      <slot name="title-after" />
    </q-item-label>

    <q-item-section side>
      <slot />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
  color?: string
}>()
</script>

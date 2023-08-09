<template>
  <div
    class="row justify-end"
    style="max-height: 40px; overflow-y: hidden;"
  >
    <div class="col-auto">
      <!-- Multitypes button to offer a menu -->

      <q-btn
        v-if="multipleTypes"
        class="q-ml-sm"
        icon="mdi-tag-multiple"
        color="grey-7"
        size="sm"
        flat
        dense
      >
        <q-menu>
          <q-list dense>
            <q-item
              v-for="t in multipleTypes"
              :key="t"
              clickable
              v-close-popup
              @click="$emit('change-type', t)"
            >
              <q-item-section>{{ t }}</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>

    <!-- Label -->

    <span
      class="text-bold"
      style="margin-left: 36px; text-align: end; cursor: default;"
    >
      <q-tooltip :delay="500">
        {{ label }}
      </q-tooltip>
      {{ label }}:
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  // label to display
  label: string
  // multiple types to allow selecting from
  multipleTypes?: string[]
}>()

defineEmits<{
  (e: 'change-type', value: string): void,
}>()
</script>

<template>
  <div class="row justify-end">
    <div class="col-auto">
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

    <span class="text-bold">{{ label }}:</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  multipleTypes?: string[]
}>()

defineEmits<{
  (e: 'change-type', value: string): void,
}>()
</script>

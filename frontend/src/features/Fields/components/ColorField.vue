<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :bg-color="value"
    dense
    outlined
  >
    <template #append>
      <q-icon
        class="cursor-pointer"
        name="mdi-eyedropper-variant"
      >
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
          cover
        >
          <q-color
            v-model="value"
            default-view="palette"
            no-header
          />
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | null | undefined;
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

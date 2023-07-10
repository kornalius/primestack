<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :rules="['date']"
    mask="date"
    dense
    outlined
  >
    <template #append>
      <q-icon class="cursor-pointer" name="mdi-calendar">
        <q-popup-proxy transition-show="scale" transition-hide="scale" cover>
          <q-date v-model="value">
            <div class="row items-center justify-end">
              <q-btn
                label="Close"
                color="primary"
                flat
                v-close-popup
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: string | any[] | any | null | undefined;
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | any[] | any | null | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

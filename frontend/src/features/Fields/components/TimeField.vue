<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :rules="['time']"
    mask="time"
  >
    <template #append>
      <q-icon class="cursor-pointer" name="mdi-clock-outline">
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
          cover
        >
          <q-time
            v-model="value"
            v-bind="$attrs"
          >
            <div class="row items-center justify-end">
              <q-btn
                label="Close"
                color="primary"
                flat
                v-close-popup
              />
            </div>

            <template v-for="(_, name) in $slots" #[name]="slotData">
              <slot :name="name" v-bind="slotData" />
            </template>
          </q-time>
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

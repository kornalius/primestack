<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :rules="['date']"
    mask="date"
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

            <template v-for="(_, slot) in $slots" #[slot]="scope">
              <slot :name="slot" v-bind="scope || {}" />
            </template>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-input>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: string | any[] | any | null | undefined
  tooltip?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | any[] | any | null | undefined): void,
}>()

const value = useModelValue(props, emit)
</script>

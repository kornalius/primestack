<template>
  <div class="row q-gutter-sm">
    <div
      v-for="column in columns"
      :key="column._id"
      class="col"
    >
      <form-display
        v-model="value"
        :fields="column.fields"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TFormColumn } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import FormDisplay from '@/features/Form/components/FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  columns: TFormColumn[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)
</script>

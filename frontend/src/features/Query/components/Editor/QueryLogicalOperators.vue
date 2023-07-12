<template>
  <div class="row">
    <div class="col">
      <q-option-group v-model="value">
        <q-radio
          :disable="disable"
          label="And"
          val="and"
        />

        <q-radio
          :disable="disable"
          label="Or"
          val="or"
        />
      </q-option-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { QueryLogicalOp } from '@/shared/interfaces/query'

const props = defineProps<{
  modelValue: QueryLogicalOp
  disable?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryLogicalOp): void,
}>()

const value = useModelValue(props, emit)
</script>

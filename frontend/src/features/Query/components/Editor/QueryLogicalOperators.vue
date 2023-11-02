<template>
  <div class="row">
    <div class="col">
      <q-option-group
        v-model="value"
        class="text-caption"
        :options="options"
        dense
        inline
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { QueryLogicalOp } from '@/shared/interfaces/query'

const props = defineProps<{
  modelValue: QueryLogicalOp
  disable?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: QueryLogicalOp): void,
}>()

const value = useModelValue(props, emit)

const { t } = useI18n()

const options = computed(() => ([
  {
    label: t('query.and'),
    value: 'and',
  },
  {
    label: t('query.or'),
    value: 'or',
  },
]))
</script>

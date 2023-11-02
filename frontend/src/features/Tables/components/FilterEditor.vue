<template>
  <input-complete
    v-bind="$attrs"
    v-model="value"
    style="font-family: monospace; font-size: 12px;"
    :items="items"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { tableFieldSchema } from '@/shared/schemas/table'
import InputComplete from '@/features/Fields/components/InputComplete.vue'

type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: string | undefined
  fields?: TableField[]
  caretHeight?: number
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | undefined): void,
}>()

const value = useModelValue(props, emit)

const items = computed(() => (
  (props.fields || [])
    .filter((f) => f.queryable && f.type !== 'boolean')
    .map((f) => ({
      label: f.name,
      value: f.name,
      icon: 'mdi-key',
      color: 'orange-4',
    }))
))
</script>

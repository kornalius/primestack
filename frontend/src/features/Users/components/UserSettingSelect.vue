<template>
  <autocomplete
    v-model="value"
    v-bind="$attrs"
    :options="options"
    dense
    outline
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </autocomplete>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useModelValue } from '@/composites/prop'
import { useUser } from '@/features/Users/store'
import Autocomplete from '@/features/Fields/components/Autocomplete.vue'

const props = defineProps<{
  modelValue: unknown
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const user = useUser()

const options = computed(() => (
  Object.keys(user.settings)
))
</script>

<template>
  <q-list
    :bordered="!flat"
    :separator="!flat"
    dense
  >
    <property-editor
      v-for="name in names"
      :key="name"
      v-model="value[name]"
      :schema="schema.properties[name]"
      :required="schema.required.includes(name)"
      :label="startCase(name)"
    />
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  schema: TSchema
  flat?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const value = useModelValue(props, emit)

const names = computed(() => Object.keys(props.schema.properties))
</script>

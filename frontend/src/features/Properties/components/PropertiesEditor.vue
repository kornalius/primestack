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
      v-model:forced-types="currentForcedTypes"
      :prop-name="subPropName(name)"
      :schema="schema.properties[name]"
      :required="schema.required.includes(name)"
      :label="startCase(name)"
      :embed-label="embedLabel"
    />
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  schema: TSchema
  // remove cells borders
  flat?: boolean
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)
const currentForcedTypes = props.forcedTypes
  ? useSyncedProp(props, 'forcedTypes', emit)
  : ref({})

const names = computed(() => Object.keys(props.schema.properties))

const subPropName = (name: string) => (
  props.propName ? `${props.propName}.${name}` : name
)
</script>

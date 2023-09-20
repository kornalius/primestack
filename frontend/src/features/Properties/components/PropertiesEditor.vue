<template>
  <!-- Categories tabs -->

  <q-tabs
    v-if="displayableCategories"
    v-model="category"
    active-color="blue-4"
    indicator-color="blue-4"
    class="bg-grey-9 text-grey-1"
    dense
  >
    <q-tab
      v-for="k in Object.keys(categories)"
      :key="k"
      :name="k"
      :icon="categories[k].icon"
    />
  </q-tabs>

  <!-- Horizontal layout -->

  <div
    v-if="horizontal"
    class="row q-gutter-sm items-center"
  >
    <property-editor
      v-for="name in names"
      :key="name"
      v-model="value[name]"
      v-model:forced-types="currentForcedTypes"
      :parent="value"
      :disable="disable || disabledProperties?.includes(name)"
      :prop-name="subPropName(name)"
      :schema="schema.properties[name]"
      :required="schema.required.includes(name)"
      :label="label(name)"
      :embed-label="embedLabel"
      horizontal
    />
  </div>

  <!-- Vertical layout -->

  <q-list
    v-else
    :bordered="!flat"
    :separator="!flat"
    dense
  >
    <property-editor
      v-for="name in names"
      :key="name"
      v-model="value[name]"
      v-model:forced-types="currentForcedTypes"
      :parent="value"
      :disable="disable || disabledProperties?.includes(name)"
      :prop-name="subPropName(name)"
      :schema="schema.properties[name]"
      :required="schema.required.includes(name)"
      :label="label(name)"
      :embed-label="embedLabel"
    />
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'
import { TFormFieldCategory } from '@/shared/interfaces/forms'

const props = defineProps<{
  // object's value
  modelValue: Record<string, unknown>
  // schema to extract property definitions from
  schema: TSchema
  // is the editor disabled?
  disable?: boolean
  // remove cells borders
  flat?: boolean
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  // label overrides
  labels?: Record<string, string>
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TFormFieldCategory>
  // use an horizontal layout to display the properties
  horizontal?: boolean
  // list of disabled property names
  disabledProperties?: string[]
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

// Selected category name
const category = ref()

/**
 * Computes the property names that appear in the selected category or all property names
 */
const names = computed((): string[] => {
  if (props.categories) {
    return props.categories[category.value].names
  }
  return Object.keys(props.schema.properties)
    .filter((p) => props.schema.properties[p].hidden !== true)
})

/**
 * Computes if there are displayable categories, meaning categories with icons
 */
const displayableCategories = computed((): boolean => {
  if (props.categories) {
    return Object.keys(props.categories)
      .filter((k) => props.categories[k].icon)
      .length > 0
  }
  return false
})

/**
 * Build a property sub-name from the current property name (ex: a new item in an object)
 *
 * @param name Name of the item
 *
 * @returns {string} New item name
 */
const subPropName = (name: string | number): string => (
  props.propName ? `${props.propName}.${name}` : name.toString()
)

/**
 * When the properties change, select the first one
 */
watch(() => props.categories, () => {
  if (Object.keys(props.categories || {}).length) {
    // eslint-disable-next-line prefer-destructuring
    category.value = Object.keys(props.categories)[0]
  }
}, { immediate: true })

const label = (name: string): string => (
  startCase(props.labels?.[name] || name)
)
</script>

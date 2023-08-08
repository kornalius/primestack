<template>
  <q-card
    class="q-gutter-sm"
    v-bind="fieldBinds(field, schemaForType(field), ctx)"
    :style="style(field)"
  >
    <q-card-section
      v-for="section in sections"
      :key="section._id"
      v-bind="fieldBinds(section, schemaForType(section), ctx)"
      :style="style(section)"
    >
      <form-display
        v-model="value"
        :fields="section._fields"
        :components="components"
      />
    </q-card-section>

    <q-card-actions
      v-for="action in actions"
      :key="action._id"
      :class="{
        'card-action': true,
      }"
      v-bind="fieldBinds(action, schemaForType(action), ctx)"
      style="z-index: 1;"
      :style="style(action)"
    >
      <form-display
        v-model="value"
        :fields="action._fields"
        :components="components"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { TSchema } from '@feathersjs/typebox'
import { TFormColumn, TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useFormElements from '@/features/Forms/composites'
import { useFeathers } from '@/composites/feathers'
import useVariables from '@/features/Variables/store'
import FormDisplay from './FormDisplay.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: TFormField
  columns: TFormColumn[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, style } = useFormElements()

const { api } = useFeathers()

const store = useVariables()

const route = useRoute()

const ctx = {
  api,
  store,
  route,
  doc: value.value,
}

const sections = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((c) => c._type === 'card-section')
))

const actions = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.columns.filter((c) => c._type === 'card-actions')
))

const schemaForType = (f: TFormField | TFormColumn): TSchema | undefined => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === f._type)?.schema
)
</script>

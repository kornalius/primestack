<template>
  <q-tabs
    v-model="active"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  >
    <q-tab
      v-for="t in tabs"
      :key="t._id"
      :name="t._id"
      :content-class="`text-${t.color}`"
    >
      <q-icon
        v-if="t.icon"
        class="q-mr-sm"
        :name="t.icon"
        size="sm"
      />

      <span class="text-subtitle2">
        {{ t.label }}
      </span>

      <q-badge
        v-if="t.badgeValue"
        style="right: -28px;"
        :color="t.badgeColor"
        floating
        rounded
      >
        {{ t.badgeValue }}
      </q-badge>
    </q-tab>
  </q-tabs>

  <div class="panels">
    <q-tab-panels
      :model-value="active"
      :vertical="(field as any).vertical"
      animated
    >
      <q-tab-panel
        v-for="t in tabs"
        :key="t._id"
        :name="t._id"
      >
        <form-display
          v-model="value"
          :fields="t._fields as FormField[]"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { useExpression } from '@/features/Expression/composites'
import { fieldSchema, tabSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { useFormElements } from '../composites'
import FormDisplay from './FormDisplay.vue'

type FormField = Static<typeof fieldSchema>
type FormTab = Static<typeof tabSchema>

const props = defineProps<{
  modelValue: Record<string, unknown>
  field: FormField
  tabs: FormTab[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const { fieldBinds, schemaForField } = useFormElements()

const { buildCtx } = useExpression()

const ctx = buildCtx()

const active = ref()

watch(() => (props.field as AnyData).field, () => {
  if ((props.field as AnyData).field) {
    active.value = (props.field as AnyData).field
  }
}, { immediate: true })

watch(active, () => {
  if ((props.field as AnyData).field) {
    (props.field as AnyData).field = active.value
  }
})
// eslint-disable-next-line no-underscore-dangle
watch(() => props.field._columns, () => {
  // when no active tab, select the first one if possible
  if (!active.value) {
    // eslint-disable-next-line no-underscore-dangle
    active.value = props.field?._columns?.[0]?._id
  }
}, { immediate: true })
</script>

<style scoped lang="sass">
.panels
  min-height: 64px
</style>

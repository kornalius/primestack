<template>
  <q-item class="q-px-none" dense>
    <q-item-section>
      <div
        class="row"
        :class="{ 'items-center': type !== 'array' }"
      >
        <div
          v-if="label"
          class="col-4 q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
        >
          <div class="row justify-end">
            <div class="col-auto">
              <span class="text-bold">{{ label }}</span>
            </div>
          </div>
        </div>

        <div class="col">
          <q-input
            v-if="type === 'string'"
            v-model="value"
            dense
            outlined
          />

          <q-slider
            v-else-if="type === 'slider'"
            v-model="value"
            :min="schema.minimum"
            :max="schema.maximum"
            :step="schema.step"
            snap
            markers
            marker-labels
            label
            dense
          />

          <q-input
            v-else-if="type === 'number'"
            v-model="value"
            type="number"
            dense
            outlined
          />

          <date-field
            v-else-if="type === 'date'"
            v-model="value"
            dense
            outlined
          />

          <time-field
            v-if="type === 'time'"
            v-model="value"
            dense
            outlined
          />

          <q-checkbox
            v-if="type === 'boolean'"
            v-model="value"
            class="full-width"
            dense
          />

          <q-select
            v-if="type === 'select'"
            v-model="value"
            :options="options"
            :option-label="optionLabel"
            :option-value="optionValue"
            :autocomplete="optionLabel"
            :multiple="multiple"
            :use-chips="multiple"
            dense
            emit-value
            outlined
            options-dense
          />

          <icon-field
            v-if="type === 'icon'"
            v-model="value"
            dense
            outlined
            options-dense
            clearable
          />

          <color-field
            v-if="type === 'color'"
            v-model="value"
            :css-class-prefix="cssClassPrefix"
            quasar-palette
            dense
            outlined
          />

          <properties-editor
            v-if="type === 'object'"
            v-model="value"
            :schema="objectSchema"
            flat
          />

          <array-editor
            v-if="type === 'array'"
            v-model="value"
            add-button="bottom"
            :add-function="() => addItem(value)"
            :remove-function="(value: unknown, index: number) => removeItem(value, index)"
          >
            <template #default="{ index }">
              <properties-editor
                v-if="arraySchemaIsObject"
                v-model="value[index]"
                :schema="arraySchema"
                flat
              />

              <property-editor
                v-else
                v-model="value[index]"
                :schema="arraySchema"
                :required="arraySchema.required"
              />
            </template>
          </array-editor>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { defaultValueForSchema } from '@/utils/schemas'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import DateField from '@/features/Fields/components/DateField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import IconField from '@/features/Fields/components/IconField.vue'

const props = defineProps<{
  modelValue: unknown
  schema: TSchema
  required?: boolean
  label?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const value = useModelValue(props, emit)

const options = computed((): unknown[] | undefined => {
  const p = props.schema
  if (p.enum) {
    return p.enum.map((e) => ({ label: e, value: e }))
  }
  if (p.items?.enum) {
    return p.items.enum.map((e) => ({ label: e, value: e }))
  }
  return p.options || p.items?.options
})

const optionValue = computed((): string | undefined => {
  const p = props.schema
  return p.optionValue || p.items?.optionValue
})

const optionLabel = computed((): string | undefined => {
  const p = props.schema
  return p.optionLabel || p.items?.optionLabel
})

const multiple = computed((): boolean => {
  const p = props.schema
  return p.type === 'array'
})

const cssClassPrefix = computed((): 'text' | 'bg' => {
  const p = props.schema
  return p.text ? 'text' : 'bg'
})

const type = computed((): string => {
  const p = props.schema
  if (p.type === 'number' && p.minimum !== undefined && p.maximum !== undefined) {
    return 'slider'
  }
  if (p.type === 'number') {
    return 'number'
  }
  if (p.type === 'string' && p.format === 'date') {
    return 'date'
  }
  if (p.type === 'string' && p.format === 'time') {
    return 'time'
  }
  if (p.type === 'string' && Array.isArray(options.value)) {
    return 'select'
  }
  if (p.type === 'string' && p.color) {
    return 'color'
  }
  if (p.type === 'string' && p.icon) {
    return 'icon'
  }
  if (p.type === 'string' && p.enum) {
    return 'select'
  }
  if (p.type === 'string') {
    return 'string'
  }
  if (p.type === 'boolean') {
    return 'boolean'
  }
  if (p.type === 'array' && p.items?.type === 'string' && Array.isArray(options.value)) {
    return 'select'
  }
  if (p.type === 'array') {
    return 'array'
  }
  if (p.type === 'object') {
    return 'object'
  }
  return 'string'
})

const arraySchema = computed(() => props.schema.items)

const objectSchema = computed(() => props.schema)

const arraySchemaIsObject = computed(() => (
  arraySchema.value.type === 'object'
))

const addItem = (arr: unknown[]): unknown | undefined => {
  const newValue = defaultValueForSchema(arraySchema.value)
  arr.push(newValue)
  return newValue
}

const removeItem = (arr: unknown[], index: number): boolean => {
  arr.splice(index, 1)
  return true
}
</script>

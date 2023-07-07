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
            :min="prop.minimum"
            :max="prop.maximum"
            :step="prop.step"
            snap
            markers
            marker-labels
            label
            dense
            outlined
          />

          <q-input
            v-else-if="type === 'number'"
            v-model="value"
            type="number"
            dense
            square
            outlined
          />

          <q-input
            v-else-if="type === 'date'"
            v-model="value"
            :rules="['date']"
            mask="date"
            hide-bottom-space
            dense
            outlined
          >
            <template #append>
              <q-icon class="cursor-pointer" name="mdi-calendar">
                <q-popup-proxy transition-show="scale" transition-hide="scale" cover>
                  <q-date v-model="value">
                    <div class="row items-center justify-end">
                      <q-btn
                        label="Close"
                        color="primary"
                        flat
                        v-close-popup
                      />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-if="type === 'time'"
            v-model="value"
            :rules="['time']"
            mask="time"
            hide-bottom-space
            dense
            outlined
          >
            <template #append>
              <q-icon class="cursor-pointer" name="mdi-clock-outline">
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                  cover
                >
                  <q-time v-model="value">
                    <div class="row items-center justify-end">
                      <q-btn
                        label="Close"
                        color="primary"
                        flat
                        v-close-popup
                      />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-checkbox
            v-if="type === 'boolean'"
            v-model="value"
            class="full-width"
            dense
          />

          <q-select
            v-if="type === 'select'"
            v-model="value"
            :options="prop.options"
            :option-label="prop.optionLabel"
            :option-value="prop.optionValue"
            :multiple="prop.multiple"
            :use-chips="prop.multiple"
            dense
            outlined
          />

          <q-input
            v-if="type === 'color'"
            v-model="value"
            :style="{ backgroundColor: value }"
            dense
            outlined
          >
            <template #append>
              <q-icon
                class="cursor-pointer"
                name="mdi-eyedropper-variant"
              >
                <q-popup-proxy
                  transition-show="scale"
                  transition-hide="scale"
                  cover
                >
                  <q-color
                    v-model="value"
                    default-view="palette"
                    no-header
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <array-editor
            v-if="type === 'array'"
            v-model="value"
            @add="() => value.push(defaultValueFor(schema.items))"
            @remove="(index) => value.splice(index, 1)"
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
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

const props = defineProps<{
  modelValue: unknown
  schema: TSchema
  required?: boolean
  label?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits()

const value = useModelValue(props, emit)

const prop = computed(() => {
  const p = props.schema
  return {
    type: p.type,
    format: p.format,
    minimum: p.minimum,
    maximum: p.maximum,
    step: p.step,
    color: p.color,
    options: p.options || p.items?.options,
    optionValue: p.optionValue || p.items?.optionValue,
    optionLabel: p.optionLabel || p.items?.optionLabel,
    arrayType: p.items?.type,
    multiple: p.type === 'array',
    required: props.required,
  }
})

const type = computed((): string => {
  const p = prop.value
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
  if (p.type === 'string' && Array.isArray(p.options)) {
    return 'select'
  }
  if (p.type === 'string' && p.color) {
    return 'color'
  }
  if (p.type === 'string') {
    return 'string'
  }
  if (p.type === 'boolean') {
    return 'boolean'
  }
  if (p.type === 'array' && p.arrayType === 'string' && Array.isArray(p.options)) {
    return 'select'
  }
  if (p.type === 'array') {
    return 'array'
  }
  return 'string'
})

const arraySchema = computed(() => props.schema.items)

const arraySchemaIsObject = computed(() => (
  props.schema.items.type === 'object'
))

const defaultValueFor = (schema: TSchema): unknown => {
  switch (schema?.type) {
    case 'string': return ''
    case 'number': return 0
    case 'boolean': return false
    case 'array': return []
    case 'object':
      return Object.keys(schema.properties)
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueFor(schema.properties[k]) }
        ), {})
    default: return ''
  }
}

const defaultArrayValue = computed(() => defaultValueFor(props.schema.items))
</script>
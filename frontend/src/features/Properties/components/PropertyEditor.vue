<template>
  <q-item class="q-px-none" dense>
    <q-item-section>
      <div
        class="row"
        :class="{ 'items-center': type !== 'array' }"
      >
        <div
          v-if="label && !embedLabel"
          class="col-4 q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
        >
          <div class="row justify-end">
            <div class="col-auto">
              <q-btn
                v-if="multipleTypes"
                class="q-ml-sm"
                icon="mdi-tag-multiple"
                color="grey-7"
                size="sm"
                flat
                dense
              >
                <q-menu>
                  <q-list dense>
                    <q-item
                      v-for="t in multipleTypes"
                      :key="t"
                      clickable
                      v-close-popup
                      @click="changeType(t)"
                    >
                      <q-item-section>{{ t }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>

            <span class="text-bold">{{ label }}</span>
          </div>
        </div>

        <div class="col">
          <q-input
            v-if="type === 'string'"
            v-model="value"
            :label="embedLabel ? label : undefined"
            dense
            outlined
          />

          <q-slider
            v-else-if="type === 'slider'"
            v-model.number="value"
            :min="schema.min"
            :max="schema.max"
            :step="schema.step"
            snap
            markers
            marker-labels
            label
            dense
          />

          <q-input
            v-else-if="type === 'number'"
            v-model.number="value"
            :label="embedLabel ? label : undefined"
            :step="schema.step || 1"
            :min="schema.min"
            :max="schema.max"
            type="number"
            dense
            outlined
          />

          <date-field
            v-else-if="type === 'date'"
            v-model="value"
            :label="embedLabel ? label : undefined"
            hide-bottom-space
            dense
            outlined
          />

          <time-field
            v-else-if="type === 'time'"
            v-model="value"
            :label="embedLabel ? label : undefined"
            hide-bottom-space
            dense
            outlined
          />

          <q-checkbox
            v-else-if="type === 'boolean'"
            v-model="value"
            class="full-width"
            :label="embedLabel ? label : undefined"
            dense
          />

          <q-select
            v-else-if="type === 'select'"
            v-model="value"
            :label="embedLabel ? label : undefined"
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
            v-else-if="type === 'icon'"
            v-model="value"
            :label="embedLabel ? label : undefined"
            dense
            outlined
            options-dense
            clearable
          />

          <color-field
            v-else-if="type === 'color'"
            v-model="value"
            :label="embedLabel ? label : undefined"
            quasar-palette
            dense
            outlined
          />

          <properties-editor
            v-else-if="type === 'object'"
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :prop-name="propName"
            :schema="objectSchema"
            embed-label
            flat
          />

          <array-editor
            v-else-if="type === 'array'"
            v-model="value"
            add-button="bottom"
            :add-function="() => addItem(value)"
            :remove-function="(v: unknown, idx: number) => removeItem(value, idx)"
            :no-separator="!arraySchemaIsObject"
          >
            <template #default="{ index }">
              <properties-editor
                v-if="arraySchemaIsObject"
                v-model="value[index]"
                v-model:forced-types="currentForcedTypes"
                :prop-name="subPropName(index)"
                :schema="arraySchema"
                embed-label
                flat
              />

              <property-editor
                v-else
                v-model="value[index]"
                v-model:forced-types="currentForcedTypes"
                :prop-name="subPropName(index)"
                :schema="arraySchema"
                :required="arraySchema.required"
                embed-label
              />
            </template>
          </array-editor>
        </div>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { useSchema } from '@/composites/schema'
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
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes: Record<string, string>
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)
const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

const { getTypeFor, optionsForSchema, defaultValueForSchema } = useSchema()

const options = computed((): unknown[] | undefined => {
  const p = props.schema
  return optionsForSchema(p)
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

const type = computed((): string => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value[props.propName])
})

const multipleTypes = computed((): string[] | undefined => {
  const p = props.schema
  if (p.anyOf) {
    return p.anyOf.map((t) => t.type)
  }
  return undefined
})

watch(value, () => {
  // when the value changes to '' and its type is 'string', set it to undefined instead
  if (value.value === '' && type.value === 'string') {
    emit('update:model-value', undefined)
  }
})

const arraySchema = computed(() => props.schema.items)

const objectSchema = computed(() => props.schema)

const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value[props.propName]) === 'object'
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

const changeType = (t: string) => {
  currentForcedTypes.value[props.propName] = t
  emit('update:model-value', undefined)
}

const subPropName = (name: string | number) => (
  props.propName ? `${props.propName}.${name.toString()}` : name.toString()
)
</script>

<template>
  <q-item
    v-if="nonExpandable"
    style="padding: 2px 0 !important;"
    dense
  >
    <q-item-section>
      <div
        :class="{
          label: true,
          row: true,
          'q-pr-sm': true,
          'items-center': true,
        }"
      >
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        >
          <property-label
            :multiple-types="multipleTypes"
            :label="label"
            @change-type="changeType"
          />
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
            clearable
            emit-value
            map-options
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

          <entity-select
            v-else-if="type === 'objectid'"
            v-model="value"
            :service="schema.service"
            :query="schema.query"
            dense
            clearable
            outlined
            options-dense
            create-new
            @create="createNewObject"
          />
        </div>
      </div>
    </q-item-section>
  </q-item>

  <q-expansion-item
    v-else
    header-class="q-pa-none"
    expand-separator
  >
    <template #header>
      <div class="label row q-pr-sm full-width items-center">
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          style="width: 125px;"
        >
          <property-label
            :multiple-types="multipleTypes"
            :label="label"
            :embed-label="embedLabel"
            @change-type="changeType"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div
        :class="{
          label: true,
          row: true,
          'items-center': type !== 'array',
        }"
      >
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        />

        <div class="col">
          <properties-editor
            v-if="type === 'object' && typeof value === 'object'"
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :prop-name="propName"
            :schema="objectSchema"
            embed-label
            flat
          />

          <array-editor
            v-else-if="type === 'array' && Array.isArray(value)"
            v-model="value"
            add-button="end"
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
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { getTypeFor, optionsForSchema, defaultValueForSchema } from '@/shared/schema'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import DateField from '@/features/Fields/components/DateField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import PropertyLabel from '@/features/Properties/components/PropertyLabel.vue'
import EntitySelect from '@/features/Fields/components/EntitySelect.vue'

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

const nonExpandable = computed(() => !['object', 'array'].includes(type.value))

/**
 * Create a new service entity
 */
const createNewObject = () => {
  // eslint-disable-next-line no-console
  console.log(props.schema)
}
</script>

<style scoped lang="sass">
.label
  min-height: 40px
</style>

<template>
  <q-input
    v-if="type === 'string'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    dense
  >
    <template #append>
      <q-icon class="cursor-pointer" name="mdi-pencil" size="small">
        <q-popup-edit
          v-model="value"
          :title="label"
          auto-save
          v-slot="scope"
        >
          <q-input
            v-model="scope.value"
            style="width: 600px;"
            type="textarea"
            autofocus
            autogrow
            dense
          />
        </q-popup-edit>
      </q-icon>
    </template>
  </q-input>

  <q-checkbox
    v-else-if="type === 'boolean'"
    v-model="value"
    class="full-width"
    :label="embedLabel ? label : undefined"
    dense
  />

  <q-slider
    v-else-if="type === 'slider'"
    v-model.number="value"
    :min="schema.min"
    :max="schema.max"
    :step="schema.step"
    :markers="property"
    :marker-labels="property"
    :snap="property"
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
    :outlined="property"
    type="number"
    dense
  />

  <date-field
    v-else-if="type === 'date'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    hide-bottom-space
    dense
  />

  <time-field
    v-else-if="type === 'time'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    hide-bottom-space
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
    :outlined="property"
    dense
    clearable
    emit-value
    map-options
    options-dense
  />

  <icon-field
    v-else-if="type === 'icon'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    dense
    options-dense
    clearable
  />

  <color-field
    v-else-if="type === 'color'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    quasar-palette
    dense
  />

  <service-select
    v-else-if="type === 'objectid'"
    v-model="value"
    :service="schema.service"
    :query="schema.query"
    :outlined="property"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
  />

  <table-select
    v-else-if="type === 'tableid'"
    v-model="value"
    :outlined="property"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
  />

  <div
    v-if="type === 'json'"
    class="ellipsis overflow-hidden cursor-pointer"
  >
    <span class="no-wrap">
      {{ jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      auto-save
      @before-show="tempJson = JSON.stringify(value, undefined, 2)"
      @before-hide="value = JSON.parse(tempJson)"
    >
      <code-editor
        v-model="tempJson"
        style="width: 600px; height: 400px;"
        lang-json
        autofocus
      />
    </q-popup-edit>
  </div>

  <padding-editor
    v-else-if="type === 'padding' && value"
    v-model="value"
  />

  <margin-editor
    v-else-if="type === 'margin' && value"
    v-model="value"
  />

  <properties-editor
    v-else-if="type === 'object' && typeof value === 'object' && property"
    v-model="value"
    v-model:forced-types="currentForcedTypes"
    :prop-name="keyName"
    :schema="objectSchema"
    :horizontal="objectIsHorizontal"
    embed-label
    flat
  />

  <div
    v-else-if="type === 'object' && typeof value === 'object' && !property"
    class="overflow-hidden ellipsis cursor-pointer"
    style="max-width: 230px;"
  >
    <span class="no-wrap">
      <q-tooltip :delay="500">
        {{ jsonValue }}
      </q-tooltip>
      {{ jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      auto-save
      v-slot="scope"
    >
      <properties-editor
        v-model="scope.value"
        v-model:forced-types="currentForcedTypes"
        :prop-name="keyName"
        :schema="objectSchema"
        :horizontal="objectIsHorizontalPopup"
        embed-label
        flat
      />
    </q-popup-edit>
  </div>

  <array-editor
    v-else-if="type === 'array' && Array.isArray(value) && property"
    v-model="value"
    add-button="end"
    :add-function="() => addItem(value)"
    :remove-function="(v: unknown, idx: number) => removeItem(value, idx)"
    :no-separator="!arraySchemaIsObject"
    reorderable
  >
    <template #default="{ index }">
      <properties-editor
        v-if="arraySchemaIsObject"
        v-model="value[index]"
        v-model:forced-types="currentForcedTypes"
        :prop-name="subPropName(index)"
        :schema="arraySchema"
        :horizontal="arrayIsHorizontal"
        embed-label
        flat
      />

      <property-editor
        v-else
        v-model="value[index]"
        v-model:forced-types="currentForcedTypes"
        :parent="value"
        :prop-name="subPropName(index)"
        :schema="arraySchema"
        :required="arraySchema.required"
        embed-label
      />
    </template>
  </array-editor>

  <div
    v-else-if="type === 'query' && typeof value === 'object' && property"
    class="overflow-hidden ellipsis cursor-pointer"
    style="max-width: 230px;"
  >
    <span class="no-wrap">
      <q-tooltip :delay="500">
        {{ queryValue }}
      </q-tooltip>

      {{ queryValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      auto-save
      v-slot="scope"
    >
      <query-editor
        v-model="scope.value"
        style="min-width: 600px; min-height: 400px;"
        :table-id="parent.tableId"
        :hide-table-select="!!parent.tableId"
      />
    </q-popup-edit>
  </div>

  <div
    v-else-if="type === 'array' && Array.isArray(value) && !property"
    class="overflow-hidden ellipsis cursor-pointer"
    style="max-width: 230px;"
  >
    <span class="no-wrap">
      <q-tooltip :delay="500">
        {{ jsonValue }}
      </q-tooltip>

      {{ jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      auto-save
      v-slot="scope"
    >
      <array-editor
        v-model="scope.value"
        style="min-width: 600px; min-height: 400px;"
        add-button="end"
        :add-function="() => addItem(scope.value)"
        :remove-function="(v: unknown, idx: number) => removeItem(scope.value, idx)"
        :no-separator="!arraySchemaIsObject"
        reorderable
      >
        <template #default="{ index }">
          <properties-editor
            v-if="arraySchemaIsObject"
            v-model="scope.value[index]"
            v-model:forced-types="currentForcedTypes"
            :prop-name="subPropName(index)"
            :schema="arraySchema"
            :horizontal="arrayIsHorizontalPopup"
            embed-label
            flat
          />

          <property-editor
            v-else
            v-model="scope.value[index]"
            v-model:forced-types="currentForcedTypes"
            :parent="scope.value"
            :prop-name="subPropName(index)"
            :schema="arraySchema"
            :required="arraySchema.required"
            embed-label
          />
        </template>
      </array-editor>
    </q-popup-edit>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { defaultValueForSchema, getTypeFor, optionsForSchema } from '@/shared/schema'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { useQuery } from '@/features/Query/composites'
import { useFeathers } from '@/composites/feathers'
import PaddingEditor from '@/features/Fields/components/PaddingEditor.vue'
import MarginEditor from '@/features/Fields/components/MarginEditor.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import DateField from '@/features/Fields/components/DateField.vue'
import CodeEditor from '@/features/Fields/components/CodeEditor.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryEditor from '@/features/Query/components/Editor/QueryEditor.vue'
import TableSelect from '@/features/Fields/components/TableSelect.vue'
import ServiceSelect from '@/features/Fields/components/ServiceSelect.vue'

const props = defineProps<{
  modelValue: unknown
  // parent object containing the modelValue
  parent: unknown
  // table to use
  schema: TSchema
  // complex UI for PropertyEditor mainly
  property?: boolean
  required?: boolean
  // label
  label?: string
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  keyName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'create-new'): void,
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const { queryToString } = useQuery()

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

const type = computed((): string => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value?.[props.keyName])
})

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

const arraySchema = computed(() => props.schema.items)

const objectSchema = computed(() => props.schema)

const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value?.[props.keyName]) === 'object'
))

const arrayIsHorizontal = computed(() => arraySchema.value?.horizontal)

const arrayIsHorizontalPopup = computed(() => arraySchema.value?.horizontalPopup)

const objectIsHorizontal = computed(() => objectSchema.value?.horizontal)

const objectIsHorizontalPopup = computed(() => objectSchema.value?.horizontalPopup)

const subPropName = (name: string | number) => (
  props.keyName ? `${props.keyName}.${name.toString()}` : name.toString()
)

const addItem = (arr: unknown[]): unknown | undefined => {
  const newValue = defaultValueForSchema(arraySchema.value)
  arr.push(newValue)
  return newValue
}

const removeItem = (arr: unknown[], index: number): boolean => {
  arr.splice(index, 1)
  return true
}

const tempJson = ref()

const { api } = useFeathers()

const { data: tables } = api.service('tables').useFind({
  query: {},
})

const table = computed(() => (
  tables.value?.[0]?.list.find((s) => s._id === props.parent?.tableId)
))

const queryValue = computed(() => (
  type.value === 'query' && typeof value.value === 'object' && props.property
    ? queryToString(value.value, table.value) || '&nbsp;'
    : '&nbsp;'
))

const jsonValue = computed(() => (
  (type.value === 'object' && typeof value.value === 'object' && !props.property)
  || (type.value === 'array' && Array.isArray(value.value) && !props.property)
  || (type.value === 'json')
    ? JSON.stringify(value.value) || '&nbsp;'
    : '&nbsp;'
))
</script>

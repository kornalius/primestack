<template>
  <q-input
    v-if="type === 'string'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    dense
    @keydown="editor.preventSystemUndoRedo"
  >
    <template #append>
      <q-icon
        :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
        name="mdi-pencil"
        size="small"
      >
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
            @keydown="editor.preventSystemUndoRedo"
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
    :disable="disabled"
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
    :disable="disabled"
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
    :disable="disabled"
    type="number"
    dense
    @keydown="editor.preventSystemUndoRedo"
  />

  <date-field
    v-else-if="type === 'date'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    hide-bottom-space
    dense
    @keydown="editor.preventSystemUndoRedo"
  />

  <time-field
    v-else-if="type === 'time'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    hide-bottom-space
    dense
    @keydown="editor.preventSystemUndoRedo"
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
    :disable="disabled"
    dense
    clearable
    emit-value
    map-options
    options-dense
    @keydown="editor.preventSystemUndoRedo"
  />

  <q-btn-toggle
    v-else-if="type === 'toggles'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :options="toggleOptions"
    :clearable="clearableToggle"
    :disable="disabled"
    spread
    stretch
    unelevated
    dense
  />

  <icon-field
    v-else-if="type === 'icon'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    dense
    options-dense
    clearable
    @keydown="editor.preventSystemUndoRedo"
  />

  <color-field
    v-else-if="type === 'color'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    quasar-palette
    dense
    @keydown="editor.preventSystemUndoRedo"
  />

  <service-select
    v-else-if="type === 'objectid'"
    v-model="value"
    :service="schema.service"
    :query="schema.query"
    :outlined="property"
    :disable="disabled"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
    @keydown="editor.preventSystemUndoRedo"
  />

  <table-select
    v-else-if="type === 'tableid'"
    v-model="value"
    :outlined="property"
    :disable="disabled"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
    @keydown="editor.preventSystemUndoRedo"
  />

  <table-field-select
    v-else-if="type === 'field'"
    v-model="value"
    :table-id="tableId"
    :outlined="property"
    :disable="disabled || !tableId"
    :extra-options="extraFields"
    option-value="name"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
    @keydown="editor.preventSystemUndoRedo"
  />

  <div
    v-if="type === 'json'"
    class="ellipsis overflow-hidden"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
  >
    <span
      class="no-wrap"
      :class="{ 'text-negative': disabled }"
    >
      <q-tooltip :delay="500">
        {{ disabledLabel || JSON.stringify(value || {}, undefined, 2) }}
      </q-tooltip>

      {{ disabledLabel || jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      :disable="disabled"
      auto-save
      @before-show="tempJson = JSON.stringify(value, undefined, 2)"
      @before-hide="value = JSON.parse(tempJson)"
    >
      <code-editor
        v-model="tempJson"
        style="width: 600px; height: 400px;"
        lang-json
        autofocus
        @keydown="editor.preventSystemUndoRedo"
      />
    </q-popup-edit>
  </div>

  <padding-editor
    v-else-if="type === 'padding' && value"
    v-model="value"
    :disable="disabled"
  />

  <margin-editor
    v-else-if="type === 'margin' && value"
    v-model="value"
    :disable="disabled"
  />

  <properties-editor
    v-else-if="type === 'object' && typeof value === 'object' && property"
    v-model="value"
    v-model:forced-types="currentForcedTypes"
    :prop-name="keyName"
    :schema="objectSchema"
    :horizontal="objectIsHorizontal"
    :disable="disabled"
    embed-label
    flat
  />

  <div
    v-else-if="type === 'object' && !property"
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <span
      class="no-wrap"
      :class="{ 'text-negative': disabled }"
    >
      <q-tooltip :delay="500">
        {{ disabledLabel || JSON.stringify(value || {}, undefined, 2) }}
      </q-tooltip>

      {{ disabledLabel || jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      :disable="disabled"
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
    :disable="disabled"
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
    v-else-if="type === 'query' && property"
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <span
      class="no-wrap"
      :class="{ 'text-negative': disabled }"
    >
      <q-tooltip :delay="500">
        {{ disabledLabel || queryValue }}
      </q-tooltip>

      {{ disabledLabel || queryValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      :disable="disabled"
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
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <span
      class="no-wrap"
      :class="{ 'text-negative': disabled }"
    >
      <q-tooltip :delay="500">
        {{ disabledLabel || jsonValue }}
      </q-tooltip>

      {{ disabledLabel || jsonValue }}
    </span>

    <q-popup-edit
      v-model="value"
      :title="label"
      :disable="disabled"
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
import useAppEditor from '@/features/App/store'
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
import TableFieldSelect from '@/features/Fields/components/TableFieldSelect.vue'

const props = defineProps<{
  modelValue: unknown
  disable?: boolean
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

const value = useModelValue(props, emit, defaultValueForSchema(props.schema))

const editor = useAppEditor()

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

interface ToggleOption {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attrs?: any
  /**
   * Label of option button; Use this prop and/or 'icon', but at least one is required
   */
  label?: string
  /**
   * Icon of option button; Use this prop and/or 'label', but at least one is required
   */
  icon?: string
  /**
   * Value of the option that will be used by component model
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  /**
   * Slot name to use for this button content; Useful for customizing content or even add tooltips
   */
  slot?: string
  /**
   * Any other QBtn props (including class and style)
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [props: string]: any | undefined
}

const toggleOptions = computed((): ToggleOption[] => {
  const p = props.schema
  return p.options
})

const clearableToggle = computed((): boolean | undefined => {
  const p = props.schema
  return p.clearable
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

const table = computed(() => (
  editor.tables?.find((s) => s._id === props.parent?.tableId)
))

const queryValue = computed(() => (
  type.value === 'query' && props.property
    ? queryToString(value.value || { groups: [] }, table.value) || '()'
    : '()'
))

const jsonValue = computed(() => {
  if (type.value === 'object' && !props.property) {
    return JSON.stringify(value.value || {})
  }
  if (type.value === 'array' && !props.property) {
    return JSON.stringify(value.value || [])
  }
  if (type.value === 'json') {
    return JSON.stringify(value.value) || '▪'
  }
  return ''
})

const disabled = computed((): boolean => {
  if (props.disable) {
    return true
  }
  if (props.schema?.disable) {
    return props.schema.disable(value.value, props.parent) !== false
  }
  return false
})

const disabledLabel = computed((): string | undefined => (
  disabled.value
    ? props.schema?.disable?.(value.value, props.parent)
    : undefined
))

const form = computed(() => (
  editor.forms.find((f) => f._id === editor.formId)
))

const tableId = computed(() => (
  (props.schema.tableProp && value.value[props.schema.tableProp]) || form.value.tableId
))

const extraFields = computed(() => (
  Object.keys(form.value?.data || {}).map((k) => ({ _id: k, name: k }))
))
</script>

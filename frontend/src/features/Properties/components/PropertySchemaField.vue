<template>
  <!-- Expression -->

  <div
    v-if="isExpr(value)"
    class="row"
  >
    <div class="col overflow-hidden ellipsis" style="max-width: 230px;">
      <property-highlight
        :model-value="exprCode(value)"
        :disabled="disabled"
        :disabled-label="disabledLabel"
        language="javascript"
      />
    </div>
  </div>

  <!-- Regular string input -->

  <q-input
    v-else-if="type === 'string'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    :rules="[isNameField ? checkDuplicateName : undefined]"
    :hide-bottom-space="!isNameField"
    dense
    @keydown="editor.preventSystemUndoRedo"
  >
    <template #append>
      <!-- Popup edit -->

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

  <!-- Action -->

  <div
    v-else-if="type === 'action'"
    class="action-input row items-center"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    @click="() => !disabled && createAction()"
  >
    <div class="col">
      <span class="text-blue-4 text-italic">
        {{ value ? 'Event' : '' }}
      </span>
    </div>

    <q-icon name="mdi-flash" />
  </div>

  <!-- Boolean -->

  <q-checkbox
    v-else-if="type === 'boolean'"
    v-model="value"
    class="full-width"
    :label="embedLabel ? label : undefined"
    :disable="disabled"
    dense
  />

  <!-- Numeric slider -->

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

  <!-- Number -->

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

  <!-- Date -->

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

  <!-- Time -->

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

  <!-- Select -->

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

  <!-- Multiple Toggles -->

  <btn-toggle-multi
    v-else-if="type === 'toggles' && schema.multiple"
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

  <!-- Toggles -->

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

  <!-- Icon -->

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

  <!-- Color -->

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

  <!-- Variable -->

  <variable-select
    v-else-if="type === 'variable'"
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

  <!-- Table -->

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

  <!-- Table field -->

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

  <!-- Service -->

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

  <!-- JSON -->

  <div
    v-else-if="type === 'json'"
    class="ellipsis overflow-hidden"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
  >
    <property-highlight
      :model-value="jsonValue"
      :disabled="disabled"
      :disabled-label="disabledLabel"
      language="json"
    />

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

  <!-- Paddings -->

  <padding-editor
    v-else-if="type === 'padding' && value"
    v-model="value"
    :disable="disabled"
  />

  <!-- Margins -->

  <margin-editor
    v-else-if="type === 'margin' && value"
    v-model="value"
    :disable="disabled"
  />

  <!-- Object in complex UI -->

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

  <!-- Object in normal expandable UI -->

  <div
    v-else-if="type === 'object' && !property"
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <property-highlight
      :model-value="jsonValue"
      :disabled="disabled"
      :disabled-label="disabledLabel"
      language="json"
    />

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

  <!-- Array in complex UI -->

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
        :schema="dynamicArraySchema(value[index])"
        :categories="dynamicArraySchema(value[index]).categories"
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

  <!-- Array in normal expandable UI -->

  <div
    v-else-if="type === 'array' && Array.isArray(value) && !property"
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <property-highlight
      :model-value="jsonValue"
      :disabled="disabled"
      :disabled-label="disabledLabel"
      language="json"
    />

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
            :schema="dynamicArraySchema(scope.value[index])"
            :categories="dynamicArraySchema(scope.value[index]).categories"
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

  <!-- Query -->

  <div
    v-else-if="type === 'query' && property"
    class="overflow-hidden ellipsis"
    :class="{ 'cursor-pointer': !disabled, 'cursor-not-allowed': disabled }"
    style="max-width: 230px;"
  >
    <property-highlight
      :model-value="queryValue"
      :disabled="disabled"
      :disabled-label="disabledLabel"
      language="basic"
    />

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
        :table-id="parent?.tableId"
        :hide-table-select="!!parent?.tableId"
        show-limits
      />
    </q-popup-edit>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import omit from 'lodash/omit'
import { Static, TSchema, Type } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import {
  defaultValueForSchema,
  getTypeFor,
  optionsForSchema,
  primaryToType,
} from '@/shared/schema'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { useQuery } from '@/features/Query/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { actionSchema } from '@/shared/schemas/actions'
import { ruleTypes } from '@/features/Components/common'
import { fieldSchema } from '@/shared/schemas/form'
import { useAppEditor } from '@/features/App/store'
import { useFormElements } from '@/features/Forms/composites'
import { useExpression } from '@/features/Expression/composites'
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
import VariableSelect from '@/features/Fields/components/VariableSelect.vue'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'
import BtnToggleMulti from '@/features/Fields/components/BtnToggleMulti.vue'

type FormField = Static<typeof fieldSchema>

type Action = Static<typeof actionSchema>

const props = defineProps<{
  // value of the property
  modelValue: unknown
  // is the property disabled or not?
  disable?: boolean
  // parent object containing the modelValue
  parent: unknown
  // table to use
  schema: TSchema
  // complex UI for PropertyEditor mainly
  property?: boolean
  // is the property required?
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

// eslint-disable-next-line vue/no-setup-props-destructure
const value = useModelValue(props, emit, defaultValueForSchema(props.schema))

const tempJson = ref()

const editor = useAppEditor()

const { flattenFields } = useFormElements()

const { isExpr, exprCode } = useExpression()

const { queryToString } = useQuery()

const { t } = useI18n()

const isNameField = computed(() => props.schema.name === true)

const checkDuplicateName = (v: string): true | string => {
  if (props.schema.name === true && v) {
    const form = editor.formInstance(editor.formId)
    if (form) {
      // eslint-disable-next-line no-underscore-dangle
      const found = flattenFields(form._fields)
        .find((f: FormField) => f.name
          && f._id !== props.parent._id
          && f.name.toLowerCase() === v.toLowerCase())
      if (found) {
        return t('field_errors.name')
      }
    }
  }
  return true
}

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

/**
 * Computes the type of the property from the schema
 */
const type = computed((): string => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value?.[props.keyName])
})

/**
 * Computes the options from the schema
 */
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

/**
 * Computes toggle options from the schema
 */
const toggleOptions = computed((): ToggleOption[] => {
  const p = props.schema
  return p.options
})

/**
 * Are the toggle options clearable?
 */
const clearableToggle = computed((): boolean | undefined => {
  const p = props.schema
  return p.clearable
})

/**
 * What field is used for the option's value (select)
 */
const optionValue = computed((): string | undefined => {
  const p = props.schema
  return p.optionValue || p.items?.optionValue
})

/**
 * What field is used for the option's label (select)
 */
const optionLabel = computed((): string | undefined => {
  const p = props.schema
  return p.optionLabel || p.items?.optionLabel
})

/**
 * Should allow multiple selection for a select type property?
 */
const multiple = computed((): boolean => {
  const p = props.schema
  return p.type === 'array'
})

/**
 * Schema for an array property
 */
const arraySchema = computed(() => props.schema.items)

/**
 * Dynamic array schema for rules editing
 *
 * @param val Field value
 *
 * @returns {TSchema}
 */
const dynamicArraySchema = (val: AnyData): TSchema => {
  if (props.schema.rules) {
    const rt = ruleTypes.find((r) => r.name === val.type)
    if (rt?.options) {
      return Type.Intersect([
        arraySchema.value,
        rt.options,
      ])
    }
  }
  return arraySchema.value
}

/**
 * Schema for an object property
 */
const objectSchema = computed(() => props.schema)

/**
 * Computes if the schema of the array is an object type
 */
const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value?.[props.keyName]) === 'object'
))

/**
 * Computes if we use an horizontal layout for the array
 */
const arrayIsHorizontal = computed(() => arraySchema.value?.horizontal)

/**
 * Computes if we use an horizontal layout for editing an array in a popup
 */
const arrayIsHorizontalPopup = computed(() => arraySchema.value?.horizontalPopup)

/**
 * Computes if we use an horizontal layout for the object
 */
const objectIsHorizontal = computed(() => objectSchema.value?.horizontal)

/**
 * Computes if we use an horizontal layout for editing an object in a popup
 */
const objectIsHorizontalPopup = computed(() => objectSchema.value?.horizontalPopup)

/**
 * Build a property sub-name from the current property name (ex: a new item in an object)
 *
 * @param name Name of the item
 *
 * @returns {string} New item name
 */
const subPropName = (name: string | number): string => (
  props.keyName ? `${props.keyName}.${name.toString()}` : name.toString()
)

/**
 * Add a new item to the value when of type array
 *
 * @param arr Array to add item to
 *
 * @returns {unknown|undefined} The new item added
 */
const addItem = (arr: unknown[]): unknown | undefined => {
  const newValue = defaultValueForSchema(arraySchema.value)
  arr.push(newValue)
  return newValue
}

/**
 * Removes an item from the value when it's of type array
 *
 * @param arr Array to remove from
 * @param index Index of the item
 *
 * @returns {boolean} True when item is removed
 */
const removeItem = (arr: unknown[], index: number): boolean => {
  arr.splice(index, 1)
  return true
}

/**
 * Computes the user's table from the parent data
 */
const table = computed(() => (
  editor.tables?.find((s) => s._id === props.parent?.tableId)
))

/**
 * Computes the query value as a string
 */
const queryValue = computed((): string => (
  type.value === 'query' && props.property
    ? queryToString(value.value || { limit: 10, skip: 0, groups: [] }, table.value) || '()'
    : '()'
))

/**
 * Computes the json value as a string
 */
const jsonValue = computed((): string => {
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

/**
 * Is editing disabled?
 */
const disabled = computed((): boolean => {
  if (props.disable) {
    return true
  }
  if (props.schema?.disable) {
    return props.schema.disable(value.value, props.parent) !== false
  }
  return false
})

/**
 * When disabled, extract the label to display from the schema
 */
const disabledLabel = computed((): string | undefined => (
  disabled.value
    ? props.schema?.disable?.(value.value, props.parent)
    : undefined
))

/**
 * Computes the currently edited user's form
 */
const form = computed(() => (
  editor.forms.find((f) => f._id === editor.formId)
))

/**
 * Computes the user's table id from the schema of the form's tableId
 */
const tableId = computed(() => {
  if (editor.selectedTable) {
    return editor.selectedTable
  }
  return (props.schema.tableProp && value.value[props.schema.tableProp])
    || props.parent?.tableId
    || form.value.tableId
})

/**
 * Computes the fields from the form's data property
 */
const extraFields = computed(() => (
  Object.keys(form.value?.data || {}).map((k) => ({
    _id: k,
    name: k,
    type: primaryToType(form.value?.data?.[k]),
  }))
))

/**
 * Creates a new user's action
 *
 * @returns {Action} The new user's action
 */
const createAction = (): Action => {
  const act = editor.actionInstance(value.value)
  if (act) {
    editor.setActionId(act._id)
    return act
  }

  const a = editor.createAction(
    omit(props.schema, ['properties', 'type', 'objectid', 'action']),
    true,
  )
  value.value = a._id
  return a
}
</script>

<style scoped lang="sass">
.action-input
  width: 100%
  height: 40px
  padding: 8px
  outline: 1px solid $grey-5
  border-radius: 3px
  position: relative
  background: white

  & .q-icon
    position: absolute
    right: 8px
    top: 13px
</style>

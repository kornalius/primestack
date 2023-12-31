<template>
  <!-- Expression -->

  <div
    v-if="isExpr(value) || type === 'expr'"
    class="row items-center"
    style="cursor: default; width: 100%; height: 20px;"
  >
    <div class="col overflow-hidden ellipsis" style="max-width: 230px; width: 100%; height: 100%;">
      <q-card style="background: transparent; cursor: pointer; width: 100%; height: 100%;" flat>
        <property-highlight
          :model-value="exprCode(value)"
          :disabled="disabled"
          :disabled-label="disabledLabel"
          language="javascript"
        />

        <q-popup-edit
          v-model="value"
          :title="t('expressions.title', { label })"
          auto-save
          @before-show="loadExpr"
          @before-hide="saveExpr"
        >
          <code-editor
            v-model="tempCode"
            style="width: 800px; height: 450px;"
            lang-js
            autofocus
            @keydown="editor.preventSystemUndoRedo"
          />
        </q-popup-edit>
      </q-card>

      <q-btn
        v-if="value && value.length > 0"
        class="clear-btn"
        :style="{ opacity: isExpr(value) || hover ? 1 : 0 }"
        icon="mdi-close-circle"
        color="grey-6"
        dense
        flat
        round
        @click.stop="cleanValue"
      />
    </div>
  </div>

  <!-- Regular string input -->

  <q-input
    v-else-if="type === 'string'"
    v-model="value"
    class="property"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    :clearable="hover"
    dense
    @keydown="editor.preventSystemUndoRedo"
  >
    <template #append>
      <!-- Popup edit -->

      <q-btn
        icon="mdi-pencil"
        size="sm"
        color="grey-7"
        dense
        flat
        round
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
            clearable
            @keydown="editor.preventSystemUndoRedo"
          />
        </q-popup-edit>
      </q-btn>
    </template>

    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
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

    <q-icon
      :color="value ? 'orange-8' : 'grey-5'"
      name="mdi-flash"
    />

    <q-btn
      v-if="value"
      class="clear-btn"
      :disable="disabled"
      icon="mdi-close-circle"
      color="grey-6"
      flat
      dense
      round
      @click.stop="clearAction"
    />

    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </div>

  <!-- Boolean -->

  <q-toggle
    v-else-if="type === 'boolean'"
    v-model="value"
    class="full-width"
    :label="checkboxLabel"
    :disable="disabled"
    :color="schema.color"
    :indeterminate-value="undefined"
    keep-color
    dense
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-toggle>

  <!-- Numeric slider -->

  <q-slider
    v-else-if="type === 'slider'"
    v-model.number="value"
    :min="schema.min"
    :max="schema.max"
    :step="schema.step || 1"
    :markers="property"
    :marker-labels="property"
    :snap="property"
    :disable="disabled"
    :color="schema.color"
    label
    dense
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-slider>

  <!-- Numeric rating -->

  <q-rating
    v-else-if="type === 'rating'"
    v-model.number="value"
    :max="schema.max"
    :disable="disabled"
    :color="schema.color"
    size="sm"
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-rating>

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
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-input>

  <!-- Date -->

  <date-field
    v-else-if="type === 'date'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
    hide-bottom-space
    dense
    clearable
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- Time -->

  <time-field
    v-else-if="type === 'time'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
    hide-bottom-space
    dense
    clearable
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
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-select>

  <!-- Select -->

  <q-select
    v-else-if="type === 'json-keys'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :options="jsonKeys"
    :autocomplete="label"
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
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-select>

  <!-- Multiple Toggles -->

  <btn-toggle-multi
    v-else-if="type === 'toggles' && schema.multiple"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :options="toggleOptions"
    :clearable="clearableToggle"
    :disable="disabled"
    :toggle-color="schema.color"
    :tooltip="tooltip"
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
    :toggle-color="schema.color"
    stretch
    unelevated
    dense
  >
    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-btn-toggle>

  <!-- Icon -->

  <icon-field
    v-else-if="type === 'icon'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
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
    :quasar-palette="schema.quasarPalette"
    :tooltip="tooltip"
    dense
    clearable
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- Unit -->

  <unit-button
    v-else-if="type === 'unit'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- Variable -->

  <variable-select
    v-else-if="type === 'variable'"
    v-model="value"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- User Setting -->

  <user-setting-select
    v-else-if="type === 'userSetting'"
    v-model="value"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
    dense
    clearable
    options-dense
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- Table -->

  <table-select
    v-else-if="type === 'tableid'"
    v-model="value"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
    dense
    clearable
    options-dense
    create-new
    @create="$emit('create-new')"
    @keydown="editor.preventSystemUndoRedo"
  />

  <!-- Table Field Multiple Select -->

  <q-select
    v-else-if="type === 'select-field'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :options="fields"
    :outlined="property"
    :disable="disabled"
    :multiple="schema.multiple"
    option-label="name"
    option-value="name"
    autocomplete="name"
    dense
    use-chips
    clearable
    emit-value
    map-options
    options-dense
    @keydown="editor.preventSystemUndoRedo"
  >
    <template #option="{ opt, itemProps, selected }">
      <q-separator v-if="(opt as any).name === '-'" />

      <q-item
        v-else
        class="items-center"
        v-bind="itemProps"
      >
        <q-item-section avatar>
          <q-icon
            :name="iconForType((opt as any).type)"
            :color="selected ? 'grey-4' : 'grey-7'"
            size="xs"
          />
        </q-item-section>

        <span
          :class="[
            ...fieldClass((opt as any).name),
            selected ? 'text-weight-normal' : undefined,
            selected ? 'text-grey-5' : undefined,
          ]"
        >
          {{ (opt as any).name }}
        </span>
      </q-item>
    </template>

    <q-tooltip :delay="500">
      {{ tooltip || label }}
    </q-tooltip>
  </q-select>

  <!-- Table field -->

  <field-select
    v-else-if="type === 'field'"
    v-model="value"
    :label="embedLabel ? label : undefined"
    :fields="fields"
    :outlined="property"
    :disable="disabled"
    :tooltip="tooltip"
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
    :tooltip="tooltip"
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
      max-width="500px"
      max-height="900px"
      auto-save
      @before-show="beforeJsonShow"
      @before-hide="beforeJsonHide"
    >
      <q-tabs
        v-model="tab"
        inline-label
        dense
        stretch
      >
        <q-tab
          name="json-editor"
          icon="mdi-file-tree"
          :label="$t('json_editor.visual')"
        />

        <q-tab
          name="code-editor"
          icon="mdi-code-json"
          :label="$t('json_editor.code')"
        />
      </q-tabs>

      <q-tab-panels
        v-model="tab"
        animated
      >
        <q-tab-panel
          name="json-editor"
          class="q-pa-none"
        >
          <json-editor
            v-model="value"
            style="width: 450px; height: 600px; overflow: auto;"
            :root-child-type="schema.rootType"
          />
        </q-tab-panel>

        <q-tab-panel
          name="code-editor"
          class="q-pa-none"
        >
          <code-editor
            v-model="tempJson"
            class="code-editor"
            style="width: 450px; height: 600px;"
            lang-json
            autofocus
            @keydown="editor.preventSystemUndoRedo"
          />
        </q-tab-panel>
      </q-tab-panels>
    </q-popup-edit>

    <q-btn
      v-if="value"
      class="clear-btn"
      :disable="disabled"
      icon="mdi-close-circle"
      color="grey-6"
      flat
      dense
      round
      @click.stop="cleanValue"
    />
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

  <!-- Borders -->

  <border-editor
    v-else-if="type === 'border' && value && value.radius && value.sides"
    v-model="value"
    :disable="disabled"
  />

  <!-- Sizes -->

  <sizes-editor
    v-else-if="type === 'sizes' && value"
    v-model="value"
    :disable="disabled"
  />

  <!-- Object in complex UI -->

  <properties-editor
    v-else-if="type === 'object' && typeof value === 'object' && property"
    v-model="value"
    v-model:forced-types="currentForcedTypes"
    :parents="parents"
    :prop-name="propName"
    :schema="objectSchema"
    :horizontal="objectIsHorizontal"
    :disable="disabled"
    :include-form-data-fields="includeFormDataFields"
    :show-name="objectSchema.showName"
    :renameable="objectSchema.renameable"
    :track-expanded="trackExpanded"
    :component-type="componentType"
    :component-path="componentPath"
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
        :parents="parents"
        :prop-name="propName"
        :schema="objectSchema"
        :horizontal="objectIsHorizontalPopup"
        :include-form-data-fields="includeFormDataFields"
        :show-name="objectSchema.showName"
        :renameable="objectSchema.renameable"
        :track-expanded="trackExpanded"
        :component-type="componentType"
        :component-path="componentPath"
        embed-label
        flat
      />
    </q-popup-edit>
  </div>

  <!-- Array in complex UI -->

  <array-editor
    v-else-if="type === 'array' && Array.isArray(value) && property"
    v-model="value"
    class="q-ma-xs"
    add-button="end"
    :add-function="() => addItem()"
    :remove-function="(v: unknown, idx: number) => removeItem(idx)"
    :no-separator="!arraySchemaIsObject"
    :disable="disabled"
    :reorderable="!schema.fixed"
  >
    <template #default="{ index }">
      <properties-editor
        v-if="arraySchemaIsObject"
        v-model="value[index]"
        v-model:forced-types="currentForcedTypes"
        :root="root"
        :parents="[...parents, value]"
        :prop-name="subPropName(propName, index)"
        :schema="dynamicArraySchema(schema, value[index])"
        :categories="dynamicArraySchema(schema, value[index]).categories"
        :horizontal="arrayIsHorizontal"
        :include-form-data-fields="includeFormDataFields"
        :show-name="dynamicArraySchema(schema, value[index]).showName"
        :renameable="dynamicArraySchema(schema, value[index]).renameable"
        :track-expanded="trackExpanded"
        :component-type="componentType"
        :component-path="componentPath"
        embed-label
        flat
      />

      <property-editor
        v-else
        v-model="value[index]"
        v-model:forced-types="currentForcedTypes"
        :root="root"
        :parents="[...parents, value]"
        :prop-name="subPropName(propName, index)"
        :schema="arraySchema"
        :required="arraySchema.required"
        :include-form-data-fields="includeFormDataFields"
        :track-expanded="trackExpanded"
        :component-type="componentType"
        :component-path="componentPath"
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
        :add-function="() => addItem()"
        :remove-function="(v: unknown, idx: number) => removeItem(idx)"
        :no-separator="!arraySchemaIsObject"
        :reorderable="!schema.fixed"
      >
        <template #default="{ index }">
          <properties-editor
            v-if="arraySchemaIsObject"
            v-model="scope.value[index]"
            v-model:forced-types="currentForcedTypes"
            :root="root"
            :parents="[...parents, scope.value]"
            :prop-name="subPropName(propName, index)"
            :schema="dynamicArraySchema(schema, scope.value[index])"
            :categories="dynamicArraySchema(schema, scope.value[index]).categories"
            :horizontal="arrayIsHorizontalPopup"
            :include-form-data-fields="includeFormDataFields"
            :show-name="dynamicArraySchema(schema, scope.value[index]).showName"
            :renameable="dynamicArraySchema(schema, scope.value[index]).renameable"
            :track-expanded="trackExpanded"
            :component-type="componentType"
            :component-path="componentPath"
            embed-label
            flat
          />

          <property-editor
            v-else
            v-model="scope.value[index]"
            v-model:forced-types="currentForcedTypes"
            :root="root"
            :parents="[...parents, scope.value]"
            :prop-name="subPropName(propName, index)"
            :schema="arraySchema"
            :required="arraySchema.required"
            :include-form-data-fields="includeFormDataFields"
            :track-expanded="trackExpanded"
            :component-type="componentType"
            :component-path="componentPath"
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
        :table-id="tableId"
        :hide-table-select="!!tableId"
        show-limits
      />
    </q-popup-edit>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import omit from 'lodash/omit'
import compact from 'lodash/compact'
import hexObjectId from 'hex-object-id'
import { Static, TSchema } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { useI18n } from 'vue-i18n'
import {
  defaultValueForSchema, fieldClass, getTypeFor, iconForType, optionsForSchema, primaryToType,
} from '@/shared/schema'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { useQuery } from '@/features/Query/composites'
import { useAppEditor } from '@/features/Editor/store'
import { useTable } from '@/features/Tables/composites'
import { useExpression } from '@/features/Expression/composites'
import { useProperties } from '@/features/Properties/composites'
import { useFormElements } from '@/features/Forms/composites'
import { actionSchema } from '@/shared/schemas/actions'
import { tableFieldSchema } from '@/shared/schemas/table'
import { fieldSchema } from '@/shared/schemas/form'
import PaddingEditor from '@/features/Properties/components/PaddingEditor.vue'
import MarginEditor from '@/features/Properties/components/MarginEditor.vue'
import BorderEditor from '@/features/Properties/components/BorderEditor.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import DateField from '@/features/Fields/components/DateField.vue'
import CodeEditor from '@/features/Expression/components/CodeEditor.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import QueryEditor from '@/features/Query/components/Editor/QueryEditor.vue'
import TableSelect from '@/features/Tables/components/TableSelect.vue'
import ServiceSelect from '@/features/Fields/components/ServiceSelect.vue'
import FieldSelect from '@/features/Tables/components/FieldSelect.vue'
import VariableSelect from '@/features/Variables/components/VariableSelect.vue'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'
import BtnToggleMulti from '@/features/Fields/components/BtnToggleMulti.vue'
import JsonEditor from '@/features/Json/components/Editor/JsonEditor.vue'
import SizesEditor from '@/features/Properties/components/SizesEditor.vue'
import UserSettingSelect from '@/features/Users/components/UserSettingSelect.vue'
import UnitButton from '@/features/Properties/components/UnitButton.vue'

type Action = Static<typeof actionSchema>
type FormField = Static<typeof fieldSchema>
type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  // value of the property
  modelValue: unknown
  // root value (selected item)
  root?: unknown
  // component type
  componentType?: string
  // path for tooltip generation in PropertiesEditor
  componentPath?: string[]
  // is the property disabled or not?
  disable?: boolean
  // parent component values
  parents: AnyData[]
  // table to use
  schema: TSchema
  // complex UI for PropertyEditor mainly
  property?: boolean
  // is the property required?
  required?: boolean
  // label
  label?: string
  // tooltip
  tooltip?: string
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  // include extra form data fields in Field selector
  includeFormDataFields?: boolean
  // is the mouse hovering over this property
  hover?: boolean
  // is the element is displayed in horizontal form?
  horizontal?: boolean
  // track (store/restore) expanded states?
  trackExpanded?: boolean
}>()

const emit = defineEmits<{
  (e: 'create-new'): void,
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

watch(value, () => {
  const p = props.schema
  if (p.type === 'number') {
    if (typeof p.minimum === 'number') {
      if (value.value < p.minimum) {
        value.value = p.minimum
      }
    }
    if (typeof p.maximum === 'number') {
      if (value.value > p.maximum) {
        value.value = p.maximum
      }
    }
  }
})

const tempJson = ref()

const tab = ref('json-editor')

const jsonEditing = ref(false)

const editor = useAppEditor()

const { t } = useI18n()

const {
  isExpr,
  exprCode,
  stringToExpr,
  buildCtx,
} = useExpression(t)

const ctx = buildCtx()

const { queryToString } = useQuery()

const { tableFields } = useTable()

const { pathTo, componentsByType } = useFormElements()

const { dynamicArraySchema, getParentProp, subPropName } = useProperties(t)

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

/**
 * Computes the type of the property from the schema
 */
const type = computed((): string => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value?.[props.propName])
})

/**
 * Computes the options from the schema
 */
const options = computed((): unknown[] | undefined => {
  const p = props.schema
  return optionsForSchema(p)
})

/**
 * Returns JSON keys from a property
 *
 * @return {string[]}
 */
const jsonKeys = computed((): string[] => {
  const p = props.schema
  const json = getParentProp(
    props.parents,
    p.jsonProp,
  )
  return type.value === 'json-keys'
    ? Object.keys(json || {})
    : []
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
  return p.options.map((o) => ({ ...{ attrs: { class: 'text-grey-9' } }, ...o }))
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
 * Schema for an object property
 */
const objectSchema = computed(() => props.schema)

/**
 * Computes if the schema of the array is an object type
 */
const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value?.[props.propName]) === 'object'
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
 * Add a new item to the value when of type array
 *
 * @returns {unknown|undefined} The new item added
 */
const addItem = (): unknown | undefined => {
  let newValue = defaultValueForSchema(arraySchema.value)
  if (typeof arraySchema.value.newValue === 'function') {
    newValue = arraySchema.value.newValue(value.value)
  }
  value.value = [...value.value, newValue]
  return newValue
}

/**
 * Removes an item from the value when it's of type array
 *
 * @param index Index of the item
 *
 * @returns {boolean} True when item is removed
 */
const removeItem = (index: number): boolean => {
  value.value = [
    ...value.value.slice(0, index),
    ...value.value.slice(index + 1),
  ]
  return true
}

/**
 * Computes the currently edited user's form
 */
const form = computed(() => (
  editor.forms.find((f) => f._id === editor.formId)
))

/**
 * Computes the user's table id from the schema of the form's tableId
 */
const tableId = computed((): string | undefined => (
  getParentProp(
    props.parents,
    props.schema.tableProp || '../tableId',
  )
))

/**
 * Computes the user's table from the parent data
 */
const table = computed(() => (
  editor.tables?.find((s) => s._id === tableId.value)
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
 * Computes the fields from the form's data property
 */
const formFields = computed((): TableField[] => (
  (props.includeFormDataFields
    ? Object.keys(form.value?.data || {}).map((k) => ({
      _id: hexObjectId(),
      name: k,
      type: primaryToType(form.value?.data?.[k]),
    }))
    : []) as TableField[]
))

/**
 * If the root field is inside a List component, returns the fields from the
 * loop expression or the table fields specified
 */
const listFields = computed((): TableField[] => {
  if (!props.root) {
    return []
  }
  const frm = editor.formInstance(editor.formId)
  const path = pathTo(frm, props.root as FormField)
  let lst = [] as TableField[]
  if (path) {
    path.forEach((p) => {
      // eslint-disable-next-line no-underscore-dangle
      const comp = componentsByType[p._type]
      if (typeof comp?.fields === 'function') {
        lst = [...lst, ...comp.fields(p, editor, ctx)]
      }
    })
  }
  return lst
})

/**
 * Computes a list of fields available for the selected field component
 */
const fields = computed((): TableField[] => {
  // root form fields
  const tf = table.value?.fields?.length
    ? tableFields(
      table.value.fields || [],
      table.value.created,
      table.value.updated,
      table.value.softDelete,
    )
    : []

  return compact([
    // list fields
    ...listFields.value,

    listFields.value.length ? { name: '-', type: '' } as TableField : undefined,

    // form table fields
    ...tf,

    tf.length ? { name: '-', type: '' } as TableField : undefined,

    // form fields
    ...formFields.value,
  ])
})

/**
 * Is editing disabled?
 */
const disabled = computed((): boolean => {
  if (props.disable) {
    return true
  }
  if (props.schema?.disable) {
    return props.schema.disable(value.value, props.parents) !== false
  }
  return false
})

/**
 * When disabled, extract the label to display from the schema
 */
const disabledLabel = computed((): string | undefined => (
  disabled.value
    ? props.schema?.disable?.(value.value, props.parents)
    : undefined
))

/**
 * Returns the checkbox label depending on the orientation and if the label is embedded or not
 */
const checkboxLabel = computed(() => {
  if (type.value === 'boolean') {
    if (props.horizontal) {
      return props.embedLabel ? undefined : props.label
    }
    return props.embedLabel ? props.label : undefined
  }
  return undefined
})

/**
 * Clear the current property value
 */
const cleanValue = () => {
  value.value = undefined
}

/**
 * Actions
 */

/**
 * Creates a new user's action
 *
 * @returns {Action} The new user's action
 */
const createAction = (): Action => {
  const act = editor.actionInstance(value.value)
  if (act) {
    editor.setActionId(act._id)
    editor.setActionEvent(props.propName)
    return act
  }

  const a = editor.addAction(
    omit(props.schema, ['properties', 'type', 'objectid', 'action']),
    true,
  )
  value.value = a._id
  editor.setActionEvent(props.propName)
  return a
}

/**
 * Clear an action (remove it from the list of actions too)
 */
const clearAction = () => {
  editor.setActionId(undefined)
  editor.setActionEvent(undefined)
  const id = value.value
  if (id) {
    editor.removeAction(id)
  }
  value.value = undefined
}

/**
 * JSON
 */

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
 * Before popup editing JSON property
 */
const beforeJsonShow = () => {
  tempJson.value = JSON.stringify(value.value || {}, undefined, 2)
  jsonEditing.value = true
}

/**
 * Before hiding the JSON edit popup
 */
const beforeJsonHide = () => {
  try {
    value.value = JSON.parse(tempJson.value)
  } catch (e) {
    //
  }
  jsonEditing.value = false
}

/**
 * When property value is changed while the JSON popup editor is visible
 */
watch(value, () => {
  if (jsonEditing.value) {
    tempJson.value = JSON.stringify(value.value || {}, undefined, 2)
  }
}, { deep: true })

/**
 * When the JSON string value from the code editor is changed while the JSON popup editor is visible
 */
watch(tempJson, () => {
  if (jsonEditing.value) {
    try {
      value.value = JSON.parse(tempJson.value)
    } catch (e) {
      //
    }
  }
})

const tempCode = ref()

/**
 * Convert the property value expression into the code editor
 */
const loadExpr = () => {
  tempCode.value = exprCode(value.value) || ''
}

/**
 * Convert the expression from the code editor back into the property value
 */
const saveExpr = () => {
  value.value = stringToExpr(tempCode.value)
}
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.action-input
  position: relative
  width: 100%
  height: 40px
  padding: 8px
  outline: 1px solid $grey-5
  border-radius: 3px
  background: white

  & .q-icon
    position: absolute
    right: 8px
    top: 13px

  & .clear-btn
    right: 24px

.clear-btn
  position: absolute
  right: 0
  top: 50%
  transform: translateY(-50%)
</style>

<template>
  <!-- Horizontal layout with label but no embedded -->

  <div
    v-if="horizontal && label && !embedLabel"
    class="col-auto q-mr-md"
    :class="{ 'q-mt-sm': type === 'array' }"
    :style="`width: ${labelWidth};`"
  >
    <property-label
      v-model="value"
      :multiple-types="multipleTypes"
      :label="label"
      :icon="icon"
      :color="color"
      allow-expr
      @change-type="changeType"
    />
  </div>

  <!-- Horizontal layout -->

  <div
    v-if="horizontal"
    :class="{ col: type !== 'boolean', 'col-auto': type === 'boolean' }"
  >
    <div class="row items-center">
      <div class="col relative-position">
        <property-schema-field
          v-model="value"
          v-model:forced-types="currentForcedTypes"
          :disable="disable"
          :parents="parents"
          :schema="schema"
          :prop-name="propName"
          :label="label"
          :embed-label="embedLabel"
          :horizontal="horizontal"
          :include-form-data-fields="includeFormDataFields"
          property
        />
      </div>

      <div
        class="col-auto"
        style="width: 20px;"
      >
        <q-btn
          v-if="showExpr"
          class="q-mr-sm"
          :disable="disabled"
          :color="isExpr(value) ? 'orange-8' : 'grey-5'"
          icon="mdi-flash"
          size="sm"
          flat
          dense
        >
          <q-popup-edit
            v-model="value"
            :title="`${label} Expression...`"
            auto-save
            @before-show="loadExpr"
            @before-hide="saveExpr"
          >
            <code-editor
              v-model="tempCode"
              style="width: 600px; height: 450px;"
              lang-js
              autofocus
              @keydown="editor.preventSystemUndoRedo"
            />
          </q-popup-edit>
        </q-btn>
      </div>
    </div>
  </div>

  <!-- Non-expandable section -->

  <q-item
    v-else-if="nonExpandable"
    class="full-width"
    style="padding: 2px 0 !important;"
    dense
    @mouseover.stop="hover = true"
    @mouseleave="hover = false"
    @focus.stop="hover = true"
    @blur="hover = false"
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
        <!-- Label column -->

        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          :style="`width: ${labelWidth};`"
        >
          <property-label
            v-model="value"
            :multiple-types="multipleTypes"
            :label="label"
            :icon="icon"
            :color="color"
            allow-expr
            @change-type="changeType"
          />
        </div>

        <!-- Value column -->

        <div class="col relative-position">
          <property-schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :disable="disable"
            :parents="parents"
            :schema="schema"
            :prop-name="propName"
            :label="label"
            :embed-label="embedLabel"
            :horizontal="horizontal"
            :include-form-data-fields="includeFormDataFields"
            :hover="hover"
            property
          />
        </div>

        <!-- Expression button column -->

        <div class="col-auto" style="width: 24px;">
          <q-btn
            v-if="showExpr"
            class="q-mr-sm"
            :style="{ opacity: isExpr(value) || hover ? 1 : 0 }"
            :disable="disabled"
            :color="isExpr(value) ? 'orange-8' : 'grey-5'"
            icon="mdi-flash"
            size="sm"
            flat
            dense
          >
            <q-menu v-model="showMenu" fit>
              <q-list dense>
                <q-item clickable>
                  <q-item-section>
                    {{ $t('expressions.edit') }}
                  </q-item-section>

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
                </q-item>

                <q-separator />

                <code-dropdown
                  :model-value="expr.dropmenu.value"
                  @insert="setFromDropMenu"
                />
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-item-section>
  </q-item>

  <!-- Expandable section (Array or Object types)  -->

  <q-expansion-item
    v-else
    header-class="q-pa-none"
    expand-separator
  >
    <template #header>
      <div
        v-if="sectionColor"
        :style="{
          position: 'absolute',
          left: '0',
          top: '0',
          width: '8px',
          height: '100%',
          background: getPaletteColor(sectionColor),
        }"
      />

      <div class="label row q-pr-sm full-width items-center">
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :style="`width: ${labelWidth};`"
        >
          <!-- Popup array edit button -->

          <q-btn
            v-if="type === 'array' && Array.isArray(value)"
            style="position: absolute; left: 8px; top: 14px;"
            :disable="disabled"
            size="xs"
            color="grey-7"
            dense
            flat
            @click.stop=""
          >
            <q-icon
              name="mdi-pencil"
              size="xs"
            />

            <q-popup-edit
              v-model="value"
              :title="label"
              auto-save
              v-slot="scope"
            >
              <array-editor
                v-model="scope.value"
                style="min-width: 600px; min-height: 400px;"
                :add-function="() => addItem(scope.value)"
                :remove-function="(v: unknown, idx: number) => removeItem(scope.value, idx)"
                :disable="disable"
                :no-separator="!arraySchemaIsObject"
                :add-label="$t('properties.array.add')"
                add-button="end"
                reorderable
              >
                <template #default="{ index }">
                  <properties-editor
                    v-if="arraySchemaIsObject"
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    :parents="[...parents, scope.value]"
                    :disable="disable"
                    :prop-name="subPropName(propName, index)"
                    :schema="dynamicArraySchema(schema, scope.value[index])"
                    :horizontal="arrayIsHorizontalPopup"
                    :include-form-data-fields="includeFormDataFields"
                    embed-label
                    flat
                  />

                  <property-editor
                    v-else
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    :parents="[...parents, scope.value]"
                    :disable="disable"
                    :prop-name="subPropName(propName, index)"
                    :schema="arraySchema"
                    :required="arraySchema.required"
                    :include-form-data-fields="includeFormDataFields"
                    embed-label
                  />
                </template>
              </array-editor>
            </q-popup-edit>
          </q-btn>

          <property-label
            v-model="value"
            :multiple-types="multipleTypes"
            :label="label"
            :icon="icon"
            :color="color"
            :embed-label="embedLabel"
            section
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
          v-if="sectionColor"
          :style="{
            position: 'absolute',
            left: '0',
            top: '0',
            width: '8px',
            height: '100%',
            background: getPaletteColor(sectionColor),
          }"
        />

        <!-- Label column -->

        <div
          v-if="label && !embedLabel && type !== 'array'"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          :style="`width: ${labelWidth};`"
        />

        <!-- Value column -->

        <div class="col">
          <property-schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :disable="disable"
            :parents="parents"
            :schema="schema"
            :prop-name="propName"
            :include-form-data-fields="includeFormDataFields"
            :label="label"
            :horizontal="horizontal"
            embed-label
            property
          />
        </div>
      </div>
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { TSchema } from '@feathersjs/typebox'
import { colors } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { getTypeFor, defaultValueForSchema, validForExpr } from '@/shared/schema'
import { useAppEditor } from '@/features/Editor/store'
import { useExpression } from '@/features/Expression/composites'
import { useProperties } from '@/features/Properties/composites'
import { AnyData } from '@/shared/interfaces/commons'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import PropertyLabel from '@/features/Properties/components/PropertyLabel.vue'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import CodeEditor from '@/features/Expression/components/CodeEditor.vue'
import CodeDropdown from '@/features/Expression/components/CodeDropdown.vue'

const props = defineProps<{
  // property value
  modelValue: unknown
  // is the property disabled?
  disable?: boolean
  // parent component values
  parents: AnyData[]
  // schema for this property
  schema: TSchema
  // is the property required?
  required?: boolean
  // label to show for the property in the editor
  label?: string
  // icon
  icon?: string
  // icon color
  color?: string
  // background color
  sectionColor?: string
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  // use an horizontal layout to display the properties
  horizontal?: boolean
  // include extra form data fields in Field selector
  includeFormDataFields?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const { t } = useI18n()

const expr = useExpression(t)

const {
  isExpr,
  exprCode,
  stringToExpr,
} = expr

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

const { getPaletteColor } = colors

const {
  subPropName,
  dynamicArraySchema,
  types,
  labelWidth,
} = useProperties(t)

const hover = ref(false)

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
 * Computes the type of the property from the schema
 */
const type = computed((): string | undefined => {
  const p = props.schema
  return getTypeFor(p, currentForcedTypes.value?.[props.propName])
})

/**
 * Computes the types allowed for a property in the schema
 */
const multipleTypes = computed((): string[] | undefined => (
  types(props.schema)
))

/**
 * Should we show the expression button next to the property?
 */
const showExpr = computed((): boolean => (
  validForExpr.indexOf(type.value) !== -1
))

/**
 * When value changes, we check if it's an empty string, if so, set its value to `undefined`
 */
watch(value, () => {
  // when the value changes to '' and its type is 'string', set it to undefined instead
  if (value.value === '' && type.value === 'string') {
    emit('update:model-value', undefined)
  }
})

/**
 * Computes the array schema for the property
 */
const arraySchema = computed(() => props.schema.items)

/**
 * Is the property part of an horizontal layout?
 */
const arrayIsHorizontalPopup = computed(() => arraySchema.value?.horizontalPopup)

/**
 * Is the array schema for this property considered an object?
 */
const arraySchemaIsObject = computed(() => (
  getTypeFor(arraySchema.value, currentForcedTypes.value[props.propName]) === 'object'
))

/**
 * Add a new item to the array value of the property
 *
 * @param arr Array to add to
 *
 * @returns {unknown | undefined} The newly added item
 */
const addItem = (arr: unknown[]): unknown | undefined => {
  const newValue = defaultValueForSchema(arraySchema.value)
  arr.push(newValue)
  return newValue
}

/**
 * Remove an item from the value array of the property
 *
 * @param arr Array to remove from
 * @param index Index of the item
 *
 * @returns {boolean} True if the item was removed
 */
const removeItem = (arr: unknown[], index: number): boolean => {
  arr.splice(index, 1)
  return true
}

/**
 * Change the type the property to another
 *
 * @param newType New type assigned to the property
 */
const changeType = (newType: string) => {
  currentForcedTypes.value[props.propName] = newType
  emit('update:model-value', undefined)
}

/**
 * Is the property non-expandable?
 */
const nonExpandable = computed(() => !['object', 'array'].includes(type.value))

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

const showMenu = ref(false)

/**
 * Set the value of the property as an expression from the expression dropdown menu
 *
 * @param text
 */
const setFromDropMenu = (text: string) => {
  if (text) {
    value.value = stringToExpr(text)
    showMenu.value = false
  }
}
</script>

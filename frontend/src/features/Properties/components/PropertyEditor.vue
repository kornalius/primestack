<template>
  <!-- Horizontal layout with label but no embedded -->

  <div
    v-if="horizontal && label && !embedLabel"
    class="col-auto q-mr-md"
    :class="{ 'q-mt-sm': type === 'array' }"
    style="width: 125px;"
  >
    <property-label
      v-model="value"
      :multiple-types="multipleTypes"
      :label="label"
      allow-expr
      @change-type="changeType"
    />
  </div>

  <!-- Horizontal layout -->

  <div
    v-if="horizontal"
    class="col"
  >
    <property-schema-field
      v-model="value"
      v-model:forced-types="currentForcedTypes"
      :disable="disable"
      :parent="parent"
      :schema="schema"
      :key-name="propName"
      :label="label"
      :embed-label="embedLabel"
      property
    />
  </div>

  <div
    v-if="horizontal"
    class="col-auto"
    style="width: 20px;"
  >
    <q-btn
      v-if="showExpr"
      class="q-mr-sm"
      icon="mdi-flash"
      :color="isExpr(value) ? 'orange-8' : 'grey-5'"
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
          v-model="value"
          style="width: 600px; height: 150px;"
          lang-js
          autofocus
          @keydown="editor.preventSystemUndoRedo"
        />
      </q-popup-edit>
    </q-btn>
  </div>

  <!-- Non-expandable section -->

  <q-item
    v-else-if="nonExpandable"
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
        <!-- Label column -->

        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        >
          <property-label
            v-model="value"
            :multiple-types="multipleTypes"
            :label="label"
            allow-expr
            @change-type="changeType"
          />
        </div>

        <!-- Value column -->

        <div class="col">
          <property-schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :disable="disable"
            :parent="parent"
            :schema="schema"
            :key-name="propName"
            :label="label"
            :embed-label="embedLabel"
            property
          />
        </div>

        <!-- Expression button column -->

        <div class="col-auto" style="width: 20px;">
          <q-btn
            v-if="showExpr"
            class="q-mr-sm"
            :disable="disable"
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
                v-model="value"
                style="width: 600px; height: 150px;"
                lang-js
                autofocus
                @keydown="editor.preventSystemUndoRedo"
              />
            </q-popup-edit>
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
      <div class="label row q-pr-sm full-width items-center">
        <div
          v-if="label && !embedLabel"
          class="col-auto q-mr-md"
          style="width: 125px;"
        >
          <!-- Popup array edit button -->

          <q-btn
            v-if="type === 'array' && Array.isArray(value)"
            style="position: absolute; left: 8px; top: 14px;"
            size="sm"
            color="grey-7"
            dense
            flat
            @click.stop=""
          >
            <q-icon name="mdi-pencil" />

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
                add-button="end"
                add-label="Click here to add a new item"
                reorderable
              >
                <template #default="{ index }">
                  <properties-editor
                    v-if="arraySchemaIsObject"
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    :disable="disable"
                    :prop-name="subPropName(index)"
                    :schema="dynamicArraySchema(scope.value[index])"
                    :horizontal="arrayIsHorizontalPopup"
                    embed-label
                    flat
                  />

                  <property-editor
                    v-else
                    v-model="scope.value[index]"
                    v-model:forced-types="currentForcedTypes"
                    v-model:parent="scope.value"
                    :disable="disable"
                    :prop-name="subPropName(index)"
                    :schema="arraySchema"
                    :required="arraySchema.required"
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
        <!-- Label column -->

        <div
          v-if="label && !embedLabel && type !== 'array'"
          class="col-auto q-mr-md"
          :class="{ 'q-mt-sm': type === 'array' }"
          style="width: 125px;"
        />

        <!-- Value column -->

        <div class="col">
          <property-schema-field
            v-model="value"
            v-model:forced-types="currentForcedTypes"
            :disable="disable"
            :parent="parent"
            :schema="schema"
            :key-name="propName"
            :label="label"
            embed-label
            property
          />
        </div>
      </div>
    </template>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { TSchema, Type } from '@feathersjs/typebox'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { getTypeFor, defaultValueForSchema, validForExpr } from '@/shared/schema'
import { useAppEditor } from '@/features/App/editor-store'
import { useExpression } from '@/features/Expression/composites'
import { AnyData } from '@/shared/interfaces/commons'
import { ruleTypes } from '@/features/Components/common'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import PropertyLabel from '@/features/Properties/components/PropertyLabel.vue'
import PropertySchemaField from '@/features/Properties/components/PropertySchemaField.vue'
import CodeEditor from '@/features/Expression/components/CodeEditor.vue'

const props = defineProps<{
  // property value
  modelValue: unknown
  // is the property disabled?
  disable?: boolean
  // parent object containing the modelValue
  parent: unknown
  // schema for this property
  schema: TSchema
  // is the property required?
  required?: boolean
  // label to show for the property in the editor
  label?: string
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  // use an horizontal layout to display the properties
  horizontal?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: unknown): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const { isExpr, exprCode, stringToExpr } = useExpression()

const currentForcedTypes = useSyncedProp(props, 'forcedTypes', emit)

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
const multipleTypes = computed((): string[] | undefined => {
  const p = props.schema
  if (p?.anyOf) {
    return p.anyOf.map((t) => t.type)
  }
  return undefined
})

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
 * @param t New type assigned to the property
 */
const changeType = (t: string) => {
  currentForcedTypes.value[props.propName] = t
  emit('update:model-value', undefined)
}

/**
 * Build a property sub-name from the current property name (ex: a new item in an object)
 *
 * @param name Name of the item
 *
 * @returns {string} New item name
 */
const subPropName = (name: string | number): string => (
  props.propName ? `${props.propName}.${name.toString()}` : name.toString()
)

/**
 * Is the property non-expandable?
 */
const nonExpandable = computed(() => !['object', 'array'].includes(type.value))

/**
 * Convert the property value expression into the code editor
 */
const loadExpr = () => {
  if (isExpr(value.value)) {
    value.value = exprCode(value.value)
  }
}

/**
 * Convert the expression from the code editor back into the property value
 */
const saveExpr = () => {
  value.value = stringToExpr(value.value)
}
</script>

<style scoped lang="sass">
.label
  min-height: 40px
</style>

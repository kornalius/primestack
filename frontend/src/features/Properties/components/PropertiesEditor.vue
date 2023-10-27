<template>
  <!-- Section Title & Icon -->

  <section-title
    v-if="title && icon"
    :title="title"
    :icon="icon"
  >
    <q-input
      v-model="value.name"
      class="name q-ml-md"
      dense
      outlined
    />
  </section-title>

  <!-- Categories tabs -->

  <q-tabs
    v-if="displayableCategories"
    v-model="category"
    active-color="blue-4"
    indicator-color="blue-4"
    class="bg-grey-9 text-grey-1"
    dense
  >
    <q-tab
      v-for="k in Object.keys(categories)"
      :key="k"
      :name="k"
      :icon="categories[k].icon"
    >
      <q-tooltip :delay="500">
        {{ $t(`properties.categories.${k}`) }}
      </q-tooltip>
    </q-tab>
  </q-tabs>

  <!-- Horizontal layout -->

  <div
    v-if="horizontal"
    class="row q-gutter-sm items-center"
  >
    <property-editor
      v-for="n in names"
      :key="n.name"
      v-model="value[n.name]"
      v-model:forced-types="currentForcedTypes"
      :parents="parents"
      :disable="disable || disabledProperties?.includes(n.name)"
      :prop-name="subPropName(propName, n.name)"
      :schema="schema.properties[n.name]"
      :required="schema.required.includes(n.name)"
      :label="n.label"
      :icon="n.icon"
      :color="n.color"
      :section-color="n.sectionColor"
      :embed-label="embedLabel"
      :include-form-data-fields="includeFormDataFields"
      horizontal
    />
  </div>

  <!-- Vertical layout -->

  <q-list
    v-else
    :bordered="!flat"
    :separator="!flat"
    dense
  >
    <template
      v-for="n in names"
      :key="n.name"
    >
      <property-editor
        v-if="n.name"
        v-model="value[n.name]"
        v-model:forced-types="currentForcedTypes"
        :parents="parents"
        :disable="disable || disabledProperties?.includes(n.name)"
        :prop-name="subPropName(propName, n.name)"
        :schema="schema.properties[n.name]"
        :required="schema.required.includes(n.name)"
        :label="n.label"
        :icon="n.icon"
        :color="n.color"
        :section-color="n.sectionColor"
        :embed-label="embedLabel"
        :include-form-data-fields="includeFormDataFields"
      />

      <q-expansion-item
        v-else-if="n.children?.length > 0"
        v-model="expanded[n.name]"
        header-class="q-pa-none"
        expand-separator
      >
        <template #header>
          <div
            v-if="n.sectionColor"
            :style="{
              position: 'absolute',
              left: '0',
              top: '0',
              width: '8px',
              height: '100%',
              background: getPaletteColor(n.sectionColor),
            }"
          />

          <div class="label row q-pr-sm full-width items-center">
            <div
              v-if="n.label && !embedLabel"
              class="col-auto q-mr-md"
              :style="`width: ${labelWidth};`"
            >
              <property-label
                v-model="value"
                :label="n.label"
                :icon="n.icon"
                :color="n.color"
                section
              />
            </div>
          </div>
        </template>

        <template #default>
          <div
            :class="{
              label: true,
              row: true,
              'items-center': true,
            }"
          >
            <div
              v-if="n.sectionColor"
              :style="{
                position: 'absolute',
                left: '0',
                top: '0',
                width: '8px',
                height: '100%',
                background: getPaletteColor(n.sectionColor),
              }"
            />

            <!-- Label column -->

            <div
              class="col-auto q-mr-md"
              style="text-align: end; cursor: default;"
              :style="`width: ${labelWidth};`"
            >
              <div
                v-for="c in serializeNames(n.children)"
                :key="c.name"
                class="row justify-end items-center"
                :style="`height: ${lineHeight};`"
              >
                <q-icon
                  v-if="c.icon"
                  :name="c.icon"
                  :color="c.color"
                  size="md"
                />
              </div>
            </div>

            <!-- Value column -->

            <div class="col">
              <div
                v-for="c in serializeNames(n.children)"
                :key="c.name"
                class="row items-center"
              >
                <property-editor
                  v-model="value[c.name]"
                  v-model:forced-types="currentForcedTypes"
                  :parents="parents"
                  :disable="disable || disabledProperties?.includes(c.name)"
                  :prop-name="subPropName(propName, c.name)"
                  :schema="schema.properties[c.name]"
                  :required="schema.required.includes(c.name)"
                  :label="c.label"
                  :icon="c.icon"
                  :color="c.color"
                  :section-color="n.sectionColor"
                  :include-form-data-fields="includeFormDataFields"
                  embed-label
                />
              </div>
            </div>
          </div>
        </template>
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { colors } from 'quasar'
import startCase from 'lodash/startCase'
import { TSchema } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { AnyData } from '@/shared/interfaces/commons'
import { TFormFieldCategory, PropName } from '@/shared/interfaces/forms'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { useProperties } from '@/features/Properties/composites'
import { useAppEditor } from '@/features/Editor/store'
import PropertyEditor from '@/features/Properties/components/PropertyEditor.vue'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import PropertyLabel from '@/features/Properties/components/PropertyLabel.vue'

const props = defineProps<{
  // object's value
  modelValue: Record<string, unknown>
  // section title
  title?: string
  // section icon
  icon?: string
  // parent component values
  parents: AnyData[]
  // schema to extract property definitions from
  schema: TSchema
  // is the editor disabled?
  disable?: boolean
  // remove cells borders
  flat?: boolean
  // embed the label inside the input
  embedLabel?: boolean
  // property name in the model for the property being edited
  propName: string
  // object that stores the forced types selected by the user
  forcedTypes?: Record<string, string>
  // split schema keys into different categories and order items in the properties list
  categories?: Record<string, TFormFieldCategory>
  // use an horizontal layout to display the properties
  horizontal?: boolean
  // list of disabled property names
  disabledProperties?: string[]
  // include extra form data fields in Field selector
  includeFormDataFields?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:forcedTypes', value: Record<string, string>): void,
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const { t } = useI18n()

const { getPaletteColor } = colors

const { subPropName, labelWidth, lineHeight } = useProperties(t)

const currentForcedTypes = props.forcedTypes
  ? useSyncedProp(props, 'forcedTypes', emit)
  : ref({})

/**
 * Create a user-friendly label from a property name
 *
 * @param name Name of the property
 *
 * @returns {string}
 */
const label = (name: string): string => startCase(name)

/**
 * Categories
 */

// Selected category name
const category = ref()

const serializeNames = (names: (string | PropName)[]): PropName[] => (
  names.map((n: PropName | string) => {
    if (typeof n === 'string') {
      return { label: label(n), name: n, children: [] }
    }
    return {
      label: n.label,
      name: n.name,
      icon: n.icon,
      color: n.color,
      sectionColor: n.sectionColor,
      children: n.children || [],
    }
  })
)

/**
 * Computes the property names that appear in the selected category or all property names
 */
const names = computed((): PropName[] => {
  if (props.categories) {
    return serializeNames(props.categories[category.value].names)
  }

  return serializeNames(
    Object.keys(props.schema.properties)
      .filter((p) => props.schema.properties[p].hidden !== true),
  )
})

/**
 * Computes if there are displayable categories, meaning categories with icons
 */
const displayableCategories = computed((): boolean => {
  if (props.categories) {
    return Object.keys(props.categories)
      .filter((k) => props.categories[k].icon)
      .length > 0
  }
  return false
})

/**
 * When the properties or main value change, select the last selected
 * from the store or the first one
 */
watch([value, () => props.categories], () => {
  if (Object.keys(props.categories || {}).length > 0) {
    const section = editor.section(value.value?._id)
    // eslint-disable-next-line prefer-destructuring
    category.value = section || Object.keys(props.categories)[0]
  }
}, { immediate: true })

/**
 * When category changes, update the store
 */
watch(category, () => {
  editor.setSection(value.value._id, category.value)
})

/**
 * Expanded
 */

const expanded = ref({})

/**
 * When expanded changes, update the store
 */
watch(expanded, () => {
  Object.keys(expanded.value).forEach((k) => {
    editor.setExpanded(value.value?._id, k, expanded.value[k])
  })
}, { deep: true })

/**
 * When the main value changes, update the expanded ref
 */
watch(value, () => {
  const e = editor.expandedForId(value.value?._id)
  Object.keys(e).forEach((k) => {
    expanded.value[k] = e[k]
  })
}, { immediate: true })
</script>

<style scoped lang="sass">
:deep(.name.q-field--dense .q-field__control)
  height: 32px
</style>

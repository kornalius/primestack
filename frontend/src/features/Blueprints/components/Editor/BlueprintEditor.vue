<template>
  <div class="row items-center q-gutter-sm q-mb-sm">
    <!-- Name and global -->

    <div class="col">
      <q-input
        v-model="value.name"
        :label="$t('blueprints.editor.name')"
        outlined
        dense
      />
    </div>

    <div class="col-auto">
      <q-checkbox
        v-model="global"
        :label="$t('blueprints.editor.global')"
        dense
      />
    </div>
  </div>

  <!-- Description -->

  <div class="row items-center q-mb-sm">
    <div class="col">
      <q-input
        v-model="value.description"
        :label="$t('blueprints.editor.description')"
        outlined
        dense
      />
    </div>
  </div>

  <q-separator spaced />

  <!-- Properties title -->

  <div class="row items-center">
    <div class="col">
      <span class="text-weight-medium">
        {{ $t('blueprints.editor.properties') }}
      </span>
    </div>

    <!-- Add property menu + button -->

    <div class="col-auto">
      <q-btn
        v-if="schemaPropertyNames.length > 0"
        icon="mdi-plus"
        size="sm"
        dense
        round
        flat
      >
        <q-tooltip :delay="500">
          {{ $t('blueprints.editor.addProperty') }}
        </q-tooltip>

        <q-menu>
          <q-list dense>
            <q-item
              v-for="c in Object.keys(categories)"
              :key="c"
              clickable
              v-ripple
            >
              <q-item-section style="width: 32px;" avatar>
                <q-icon
                  v-if="categories[c].icon"
                  :name="categories[c].icon"
                  size="sm"
                  color="grey-9"
                />
              </q-item-section>

              <q-item-section>
                {{ c }}
              </q-item-section>

              <q-item-section side>
                <q-icon name="mdi-menu-right" />
              </q-item-section>

              <q-menu anchor="top end" self="top start">
                <q-list dense>
                  <template
                    v-for="n in serializeNames(categories[c].names)"
                    :key="n.name"
                  >
                    <q-item
                      v-if="(!n.name && countItems(n.children) > 0) || canAdd(n.name)"
                      clickable
                      v-ripple
                      v-close-popup="countItems(n.children) === 0"
                      @click="() => n.name && addProperty(n.name)"
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

                      <q-item-section>
                        {{ n.label }}
                      </q-item-section>

                      <q-item-section
                        v-if="countItems(n.children) > 0"
                        side
                      >
                        <q-icon name="mdi-menu-right" />
                      </q-item-section>

                      <q-menu
                        v-if="countItems(n.children) > 0"
                        anchor="top end"
                        self="top start"
                      >
                        <q-list dense>
                          <template
                            v-for="ch in serializeNames(n.children)"
                            :key="ch.name"
                          >
                            <q-item
                              v-if="canAdd(ch.name)"
                              clickable
                              v-ripple
                              v-close-popup
                              @click="addProperty(ch.name)"
                            >
                              <q-item-section>
                                {{ ch.label }}
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-list>
                      </q-menu>
                    </q-item>
                  </template>
                </q-list>
              </q-menu>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>

  <q-separator />

  <!-- Properties list -->

  <div class="row">
    <div class="col">
      <div style="width: 400px; height: 600px; overflow-y: auto;">
        <properties-editor
          v-model="value.properties"
          :schema="schema"
          :parents="[]"
          :categories="categories"
          prop-name=""
          limit-to-existing
          show-category-count
        >
          <template #append="{ propName, hover }">
            <q-btn
              :style="{ opacity: hover ? 1 : 0 }"
              icon="mdi-trash-can"
              color="negative"
              size="sm"
              dense
              round
              flat
              @click.stop="removeProperty(propName)"
            />
          </template>
        </properties-editor>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, Ref, ref, watch,
} from 'vue'
import { colors } from 'quasar'
import cloneDeep from 'lodash/cloneDeep'
import startCase from 'lodash/startCase'
import unset from 'lodash/unset'
import { Static, TSchema } from '@feathersjs/typebox'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { useModelValue } from '@/composites/prop'
import { useApp } from '@/features/App/store'
import { useFormElements } from '@/features/Forms/composites'
import { PropName, TFormFieldCategory } from '@/shared/interfaces/forms'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

type Blueprint = Static<typeof blueprintSchema>
type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: Blueprint
  field: FormField
  categories: Record<string, TFormFieldCategory>
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Blueprint): void,
}>()

const value = useModelValue(props, emit) as Ref<Blueprint>

const global = ref(false)

const app = useApp()

const { getPaletteColor } = colors

const { componentsByType } = useFormElements()

/**
 * Computes the schema based on the componentType of the blueprint
 */
const schema = computed((): TSchema | undefined => (
  componentsByType[value.value.componentType]?.schema
))

/**
 * Computes the schema property names
 */
const schemaPropertyNames = computed(() => (
  Object.keys(schema.value?.properties).reduce((acc, k) => ([
    ...acc,
    k,
  ]), []).sort()
))

/**
 * Create a user-friendly label from a property name
 *
 * @param name Name of the property
 *
 * @returns {string}
 */
const label = (name: string): string => startCase(name)

const canAdd = (name: string): boolean => (
  value.value.properties[name] === undefined
)

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

const countItems = (items: (PropName | string)[]): number => (
  serializeNames(items || [])
    .filter((i) => canAdd(i.name) && value.value.properties[i.name] === undefined)
    .length
)

/**
 * Add a new property to the blueprint
 *
 * @param name Property name
 */
const addProperty = (name: string) => {
  value.value.properties[name] = cloneDeep(props.field[name])
}

/**
 * Remove the properties from plan
 *
 * @param name Property key name
 */
const removeProperty = (name: string) => {
  unset(value.value.properties, name)
}

/**
 * When the global ref is changed we change the menuId of the blueprint accordingly
 */
watch(global, () => {
  if (global.value) {
    value.value.menuId = undefined
  } else {
    value.value.menuId = app.menuId
  }
})

watch(() => value.value.menuId, () => {
  global.value = value.value.menuId === undefined
}, { immediate: true })
</script>

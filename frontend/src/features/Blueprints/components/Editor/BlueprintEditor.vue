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

    <div class="col-auto">
      <q-btn
        v-if="schemaPropertyNames.length > 0"
        icon="mdi-plus"
        size="sm"
        dense
        round
        flat
      >
        <q-menu>
          <q-list dense>
            <q-item
              v-for="k in schemaPropertyNames"
              :key="k"
              clickable
              v-ripple
              v-close-popup
              @click="addProperty(k)"
            >
              <q-item-section>
                {{ k }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </div>
  </div>

  <q-separator />

  <!-- Properties -->

  <div class="row">
    <div class="col">
      <properties-editor
        v-model="value.properties"
        :schema="schema"
        :parents="[]"
        prop-name=""
        limit-to-existing
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
            @click="removeProperty(propName)"
          />
        </template>
      </properties-editor>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, Ref, ref, watch,
} from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { Static, TSchema } from '@feathersjs/typebox'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { useFormElements } from '@/features/Forms/composites'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

type Blueprint = Static<typeof blueprintSchema>
type Field = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: Blueprint
  field: Field
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: Blueprint): void,
}>()

const value = useModelValue(props, emit) as Ref<Blueprint>

const global = ref(false)

const editor = useAppEditor()

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
  delete value.value.properties[name]
}

/**
 * When the global ref is changed we change the menuId of the blueprint accordingly
 */
watch(global, () => {
  if (global.value) {
    value.value.menuId = undefined
  } else {
    value.value.menuId = editor.selectedMenu
  }
})

watch(() => value.value.menuId, () => {
  global.value = value.value.menuId === undefined
}, { immediate: true })
</script>

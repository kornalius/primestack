<template>
  <q-btn
    v-bind="$attrs"
    icon="mdi-pencil-ruler"
    color="grey-8"
    size="sm"
    dense
    round
    flat
  >
    <q-tooltip :delay="500">
      {{ $t('blueprints.tooltip') }}
    </q-tooltip>

    <q-menu
      v-model="value"
      fit
    >
      <q-list dense>
        <!-- New -->

        <q-item
          clickable
          v-close-popup
          v-ripple
          @click="createBlueprint"
        >
          <q-item-section>
            {{ $t('blueprints.new') }}
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Global Blueprints -->

        <q-item
          v-if="editor.globalBlueprints().length > 0"
          clickable
          v-ripple
        >
          <q-item-section>
            {{ $t('blueprints.globals') }}
          </q-item-section>

          <q-item-section side>
            <q-icon name="mdi-menu-right" />
          </q-item-section>

          <q-menu anchor="top end" self="top start" fit>
            <q-list dense>
              <blueprint-select-item
                v-for="(blueprint, index) in editor.globalBlueprints()"
                :key="blueprint._id"
                :blueprint="blueprint"
                :field="field"
                :index="index"
                :hovered="hover === index + 10000"
                @focus="hover = index + 10000"
                @blur="hover = -1"
                @click="toggleBlueprint(blueprint)"
                @edit="editBlueprint(blueprint)"
              />
            </q-list>
          </q-menu>
        </q-item>

        <!-- Local Blueprints -->

        <blueprint-select-item
          v-for="(blueprint, index) in editor.localBlueprints(app.menuId)"
          :key="blueprint._id"
          :blueprint="blueprint"
          :field="field"
          :index="index"
          :hovered="hover === index"
          @focus="hover = index"
          @blur="hover = -1"
          @click="toggleBlueprint(blueprint)"
          @edit="editBlueprint(blueprint)"
        />
      </q-list>
    </q-menu>
  </q-btn>

  <!-- Dialog -->

  <q-dialog v-model="showEditor" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          {{ $t('blueprints.editor.title') }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <blueprint-editor
          v-model="editingBlueprint"
          :field="field"
          :categories="categories"
        />
      </q-card-section>

      <q-card-actions class="text-primary">
        <q-btn
          :label="$t('blueprints.editor.delete')"
          icon="mdi-trash-can"
          color="negative"
          outline
          @click="removeBlueprint"
        />

        <q-space />

        <q-btn
          :label="$t('blueprints.editor.cancel')"
          color="negative"
          outline
          @click="cancelBlueprint"
        />

        <q-btn
          :label="$t('blueprints.editor.ok')"
          color="green"
          outline
          @click="saveBlueprint"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { Static } from '@feathersjs/typebox'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAppEditor } from '@/features/Editor/store'
import { useApp } from '@/features/App/store'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { TFormComponent, TFormFieldCategory } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import BlueprintEditor from './Editor/BlueprintEditor.vue'
import BlueprintSelectItem from './Editor/BlueprintSelectItem.vue'

type Blueprint = Static<typeof blueprintSchema>
type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  // is the menu opened or not?
  modelValue: boolean
  field: FormField
  component: TFormComponent
  categories: Record<string, TFormFieldCategory>
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void,
}>()

const quasar = useQuasar()

const { t } = useI18n()

const hover = ref(-1)

const editingBlueprint = ref()

const origBlueprint = ref()

const showEditor = ref(false)

const value = useModelValue(props, emit)

const editor = useAppEditor()

const app = useApp()

/**
 * Start editing a blueprint
 *
 * @param blueprint Blueprint to edit
 */
const editBlueprint = (blueprint: Blueprint) => {
  editor.editBlueprint(blueprint._id)
  editingBlueprint.value = editor.blueprintInstance(editor.blueprintId)
  origBlueprint.value = editingBlueprint.value ? cloneDeep(editingBlueprint.value) : undefined
  showEditor.value = true
}

/**
 * Revert the blueprint to its original key values and close the dialog
 */
const cancelBlueprint = () => {
  // empty blueprint keys
  Object.keys(editingBlueprint.value).forEach((k) => {
    delete editingBlueprint.value[k]
  })

  // copy orginal blueprint keys
  Object.keys(origBlueprint.value).forEach((k) => {
    editingBlueprint.value[k] = origBlueprint.value[k]
  })

  editor.editBlueprint(undefined)
  showEditor.value = false
}

/**
 * Closes the dialog
 */
const saveBlueprint = () => {
  editor.editBlueprint(undefined)
  showEditor.value = false
}

/**
 * Create a new blueprint and edit it
 */
const createBlueprint = () => {
  const blueprint = editor.addBlueprint({
    menuId: app.menuId,
    componentType: props.component.type,
    properties: {},
  })
  editBlueprint(blueprint)
}

/**
 * Apply or Unapply the blueprint to the field
 *
 * @param blueprint Blueprint to apply or unapply
 */
const toggleBlueprint = (blueprint: Blueprint) => {
  if (editor.isBlueprintApplied(blueprint._id, props.field)) {
    editor.unapplyBlueprint(blueprint._id, props.field)
  } else {
    editor.applyBlueprint(blueprint._id, props.field)
  }
}

const removeBlueprint = () => {
  quasar.dialog({
    title: t('blueprints.editor.remove.title'),
    persistent: true,
    message: t('blueprints.editor.remove.message'),
    ok: {
      label: t('dialog.ok'),
      color: 'green',
      outline: true,
    },
    cancel: {
      label: t('dialog.cancel'),
      color: 'negative',
      outline: true,
    },
  }).onOk(() => {
    const id = editor.blueprintId
    cancelBlueprint()
    editor.removeBlueprint(id)
  })
}
</script>

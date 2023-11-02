<template>
  <q-btn
    v-bind="$attrs"
    icon="mdi-bookshelf"
    dense
    round
    flat
  >
    <q-tooltip :delay="500">
      {{ $t('blueprints.tooltip') }}
    </q-tooltip>

    <q-menu fit>
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
              <q-item
                v-for="(blueprint, index) in editor.globalBlueprints()"
                :key="blueprint._id"
                clickable
                v-close-popup
                v-ripple
                @mouseover="hover = index + 10000"
                @mouseleave="hover = -1"
                @focus="hover = index + 10000"
                @blur="hover = -1"
                @click="toggleBlueprint(blueprint)"
              >
                <!-- Checkmark -->

                <q-item-section style="width: 24px;" avatar>
                  <q-icon
                    v-if="editor.isBlueprintApplied(blueprint._id, field)"
                    name="mdi-check"
                    size="xs"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    {{ blueprint.name }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ blueprint.description }}
                  </q-item-label>
                </q-item-section>

                <!-- Edit Button -->

                <q-item-section side>
                  <q-btn
                    :style="{ opacity: hover === index + 10000 ? 1 : 0 }"
                    icon="mdi-tune-vertical-variant"
                    size="sm"
                    dense
                    round
                    flat
                    @click.stop="editBlueprint(blueprint)"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-item>

        <!-- Local Blueprints -->

        <q-item
          v-for="(blueprint, index) in editor.localBlueprints(editor.selectedMenu)"
          :key="blueprint._id"
          clickable
          v-close-popup
          v-ripple
          @mouseover="hover = index as number"
          @mouseleave="hover = -1"
          @focus="hover = index as number"
          @blur="hover = -1"
          @click="toggleBlueprint(blueprint)"
        >
          <!-- Checkmark -->

          <q-item-section style="width: 24px;" avatar>
            <q-icon
              v-if="editor.isBlueprintApplied(blueprint._id, field)"
              name="mdi-check"
              size="xs"
            />
          </q-item-section>

          <q-item-section>
            <q-item-label>
              {{ blueprint.name }}
            </q-item-label>
            <q-item-label caption>
              {{ blueprint.description }}
            </q-item-label>
          </q-item-section>

          <!-- Edit Button -->

          <q-item-section side>
            <q-btn
              :style="{ opacity: hover === index ? 1 : 0 }"
              icon="mdi-tune-vertical-variant"
              size="sm"
              dense
              round
              flat
              @click="editBlueprint(blueprint)"
            />
          </q-item-section>
        </q-item>
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
import omit from 'lodash/omit'
import { Static } from '@feathersjs/typebox'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAppEditor } from '@/features/Editor/store'
import { blueprintSchema } from '@/shared/schemas/blueprints'
import { fieldSchema } from '@/shared/schemas/form'
import { TFormComponent } from '@/shared/interfaces/forms'
import BlueprintEditor from '@/features/Blueprints/components/Editor/BlueprintEditor.vue'

type Blueprint = Static<typeof blueprintSchema>
type Field = Static<typeof fieldSchema>

const props = defineProps<{
  field: Field
  component: TFormComponent
}>()

const quasar = useQuasar()

const { t } = useI18n()

const hover = ref(-1)

const editingBlueprint = ref()

const origBlueprint = ref()

const showEditor = ref(false)

const editor = useAppEditor()

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
    menuId: editor.selectedMenu,
    componentType: props.component.type,
    properties: cloneDeep(omit(props.field, ['_id', '_type'])),
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

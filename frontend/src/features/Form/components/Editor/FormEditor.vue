<template>
  <div class="row">
    <div class="Components overflow-auto">
      <div class="fit">
        <q-list class="Drawer" dense>
          <draggable
            :list="visibleComponents"
            :item-key="(value) => visibleComponents.indexOf(value)"
            :clone="cloneComponent"
            :group="{
              name: 'form-builder',
              pull: 'clone',
              put: false,
            }"
            filter=".overlay"
            :sort="false"
            @start="editor.setDragging(true)"
            @end="editor.setDragging(false)"
          >
            <template #item="{ element: value }">
              <q-btn
                v-if="value.type !== ''"
                class="form-component q-mx-sm"
                :icon="value.icon"
                :label="value.label"
                type="button"
                size="12px"
                align="left"
                dense
                flat
                @click="onAddFieldClick(value)"
              />
            </template>
          </draggable>
        </q-list>
      </div>
    </div>

    <div class="col q-px-md" @click="editor.unselectAll()">
      <fields-editor
        v-model="fields"
        :components="components"
      />
    </div>

    <q-drawer
      :model-value="true"
      :width="400"
      side="right"
    >
      <properties-editor
        v-if="selectedField"
        v-model="selectedField"
        v-model:forced-types="forcedTypes"
        :prop-name="''"
        :schema="selectedComponent.schema"
      />
    </q-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import FieldsEditor from '@/features/Form/components/Editor/FieldsEditor.vue'
import useFormEditor from '@/features/Form/store'
import useFormElements from '@/features/Form/composites'

const props = defineProps<{
  modelValue: unknown[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const fields = useModelValue(props, emit)

const forcedTypes = ref({})

const { createFormField, flattenFields } = useFormElements()

const visibleComponents = computed(() => props.components.filter((c) => !c.hidden))

/**
 * Selection
 */

const editor = useFormEditor()

const selectedField = computed(() => (
  flattenFields(fields.value).find((f) => f._id === editor.selected)
))

const selectedComponent = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  props.components.find((c) => c.type === selectedField.value?._type)
))

const onAddFieldClick = (component: TFormComponent) => {
  const field = createFormField(component, fields.value)
  fields.value.push(field)
  editor.select(field._id)
}

const cloneComponent = (component: TFormComponent) => createFormField(component, fields.value)
</script>

<style scoped lang="sass">
.Components
  width: 290px
  border-right: 1px solid $grey-3

.Properties
  width: 400px
  border-left: 1px solid $grey-3

.form-component
  width: 125px
  height: 30px
</style>

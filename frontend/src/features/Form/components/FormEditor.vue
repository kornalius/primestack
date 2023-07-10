<template>
  <div class="row">
    <div class="col-auto">
      <div class="title">
        <span class="text-h6 text-white">Components</span>
      </div>

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
          :disabled="preview"
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
              :disabled="preview"
              type="button"
              size="12px"
              align="left"
              dense
              flat
              @click="onAddFieldClick(value.type)"
            />
          </template>
        </draggable>
      </q-list>
    </div>

    <div class="col q-px-md" @click="editor.unselectAll()">
      <div class="title">
        <div class="row items-center">
          <div class="col">
            <span class="text-h6 text-white">Form</span>
          </div>

          <div class="col-auto">
            <q-toggle
              v-model="preview"
              class="q-ml-sm text-white"
              label="Preview"
              left-label
              dense
            />

            <q-toggle
              v-model="showPreviewFormData"
              class="q-ml-sm text-white"
              :disable="!preview"
              label="Data"
              left-label
              dense
            />
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col q-py-md" @click="editor.unselectAll()">
          <fields-editor
            v-model="fields"
            v-model:preview-form-data="previewFormData"
            :components="components"
            :preview="preview"
          />
        </div>
      </div>

      <div v-if="preview && showPreviewFormData" class="q-mt-sm">
        <div class="title q-mb-sm">
          <div class="row items-center">
            <div class="col">
              <span class="text-h6 text-white">Data</span>
            </div>
          </div>
        </div>

        <pre>{{ previewFormData }}</pre>
      </div>
    </div>

    <div class="Properties col-auto">
      <div class="title">
        <span class="text-h6 text-white">Properties</span>
      </div>

      <properties-editor
        v-if="selectedField"
        v-model="selectedField"
        :schema="selectedComponent.schema"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { defaultValueForSchema } from '@/utils/schemas'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import FieldsEditor from '@/features/Form/components/FieldsEditor.vue'
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

/**
 * Preview
 */

const preview = ref(false)
const previewFormData = ref({})
const showPreviewFormData = ref(false)

watch(preview, () => {
  editor.unselectAll()
  previewFormData.value = flattenFields(fields.value)
    .reduce((acc, f) => {
      // eslint-disable-next-line no-underscore-dangle
      const comp = props.components.find((c) => c.type === f._type)
      if (comp && !comp.nokey) {
        return { ...acc, [f.name]: defaultValueForSchema(comp.schema.properties.modelValue) }
      }
      return acc
    }, {})
})

const onAddFieldClick = (type: string) => {
  const field = createFormField({ type } as TFormComponent, fields.value)
  fields.value.push(field)
  editor.select(field._id)
}

const cloneComponent = (component: TFormComponent) => createFormField(component, fields.value)
</script>

<style scoped lang="sass">
.Drawer
  width: 250px
  border-right: 1px solid $grey-3

.Properties
  width: 400px
  border-left: 1px solid $grey-3

.form-component
  width: 100px
  height: 30px

.title
  padding: 4px 8px
  background: $grey-6
</style>

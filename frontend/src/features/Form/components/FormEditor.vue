<template>
  <div class="row">
    <div class="col-auto">
      <div class="title">
        <span class="text-h6 text-white">Components</span>
      </div>

      <q-list class="Drawer" dense>
        <draggable
          :list="components"
          :item-key="(value) => components.indexOf(value)"
          :clone="createField"
          :group="{
            name: 'form-builder',
            pull: 'clone',
            put: false,
          }"
          :disabled="preview"
          :sort="false"
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

    <div class="col q-px-md" @click="unselectAll">
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
          </div>
        </div>
      </div>

      <draggable
        v-model="values"
        class="form-builder-container"
        :group="{
          name: 'form-builder',
          pull: false,
          put: true,
        }"
        filter=".form-element-header"
        :animation="150"
        easing="cubic-bezier(1, 0, 0, 1)"
        item-key="id"
        :disabled="preview"
        @change="onChange"
      >
        <template #item="{ index }">
          <form-element
            :ref="values[index].id"
            v-model="values[index]"
            :components="components"
            :selected="isSelectedForEdit(values[index].id)"
            :preview="preview"
            @click="selectForEdit"
          />
        </template>
      </draggable>
    </div>

    <div class="Properties col-auto">
      <div class="title">
        <span class="text-h6 text-white">Properties</span>
      </div>

      <properties-editor
        v-if="selectedField"
        v-model="selectedField.options"
        class="q-ml-md"
        :schema="selectedComponent.schema"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import draggable from 'vuedraggable'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { defaultValueForSchema } from '@/utils/schemas'
import FormElement from '@/features/Form/components/FormElement.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'

const props = defineProps<{
  modelValue: unknown[]
  components: TFormComponent[]
  defaultLabel?: (type: string) => string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'moved', oldIndex: number, newIndex: number): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const values = useModelValue(props, emit)

const preview = ref(false)

/**
 * Selection
 */

const selectedFieldId = ref()

const createField = (item: TFormComponent) => ({
  id: uuidv4(),
  type: item.type,
  options: Object.keys(item.schema?.properties || {})
    .reduce((acc, k) => ({ ...acc, [k]: defaultValueForSchema(item.schema.properties[k]) }), {}),
})

const selectForEdit = (field: TFormField) => {
  selectedFieldId.value = field.id
}

const isSelectedForEdit = (id: string): boolean => (
  selectedFieldId.value === id
)

const unselectAll = () => {
  selectedFieldId.value = undefined
}

const selectedField = computed(() => (
  values.value.find((v) => v.id === selectedFieldId.value)
))

const selectedComponent = computed(() => (
  props.components.find((c) => c.type === selectedField.value?.type)
))

/**
 * Draggable
 */

const onAddFieldClick = (type: string) => {
  const field = createField({ type })
  values.value.push(field)
  selectForEdit(field)
}

const onChange = (evt: AnyData) => {
  if (evt.added) {
    selectForEdit(evt.added.element)
  }
}
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

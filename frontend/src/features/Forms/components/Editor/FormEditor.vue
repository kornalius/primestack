<template>
  <q-layout view="hHh lpr lFr">
    <q-drawer
      :model-value="true"
      class="q-pa-sm"
      :width="180"
      side="left"
      behavior="desktop"
      show-if-above
      bordered
    >
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
    </q-drawer>

    <q-page-container>
      <q-page @click="editor.unselectAll()">
        <fields-editor
          v-model="fields"
          :components="components"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import { TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import useFormElements from '../../composites'
import FieldsEditor from './FieldsEditor.vue'

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

const { createFormField } = useFormElements()

const visibleComponents = computed(() => props.components.filter((c) => !c.hidden))

/**
 * Selection
 */

const editor = useAppEditor()

const onAddFieldClick = (component: TFormComponent) => {
  const field = createFormField(component, fields.value)
  fields.value.push(field)
  editor.select(field._id)
}

const cloneComponent = (component: TFormComponent) => createFormField(component, fields.value)
</script>

<style scoped lang="sass">
.Components
  width: 100px
  border-right: 1px solid $grey-3

.form-component
  width: 90%
  height: 30px

.Properties
  width: 400px
  border-left: 1px solid $grey-3
</style>

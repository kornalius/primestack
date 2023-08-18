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
              @click="editor.addFieldToForm(value)"
            />
          </template>
        </draggable>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page
        class="q-pa-sm"
        @click="unselectAll"
      >
        <fields-editor
          v-model="fields"
          :components="components"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useQuasar } from 'quasar'
import draggable from 'vuedraggable'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { formSchema } from '@/shared/schemas/form'
import { tableFieldSchema } from '@/shared/schemas/table'
import { AnyData } from '@/shared/interfaces/commons'
import { useAppEditor } from '@/features/App/store'
import FieldsEditor from './FieldsEditor.vue'

type Form = Static<typeof formSchema>
type TableField = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: unknown[]
  form: Form
  preview?: boolean
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const quasar = useQuasar()

const fields = useModelValue(props, emit)

const visibleComponents = computed(() => props.components.filter((c) => !c.hidden))

/**
 * Selection
 */

const editor = useAppEditor()

const cloneComponent = (component: TFormComponent) => editor.createFormField(component)

const autoGenerateForm = (tableId: string): void => {
  const addFieldToForm = (type: string, f: TableField, options?: AnyData): TFormField => {
    const component = props.components.find((c) => c.type === type)
    const field = editor.addFieldToForm(component, options)
    field.field = f.name
    field.label = f.name
    return field
  }

  const table = editor.tableInstance(tableId)
  if (table) {
    table.fields.forEach((f) => {
      switch (f.type) {
        case 'string':
          addFieldToForm('input', f)
          break
        case 'number':
          addFieldToForm('input', f, { type: 'number' })
          break
        case 'boolean':
          addFieldToForm('checkbox', f)
          break
        case 'date':
          addFieldToForm('date', f)
          break
        case 'time':
          addFieldToForm('time', f)
          break
        case 'color':
          addFieldToForm('color', f)
          break
        case 'icon':
          addFieldToForm('iconSelect', f)
          break
        case 'objectid':
          addFieldToForm('select', f, { optionLabel: 'name', optionValue: '_id' })
          break
        default:
      }
    })
  }
}

watch(() => props.form?.tableId, (newValue, oldValue) => {
  if (!oldValue && newValue && fields.value.length === 0) {
    quasar.dialog({
      title: 'Auto generate form?',
      persistent: true,
      message: 'Would you like to automatically generate a form with the schema of this table?',
      ok: { color: 'green', outline: true },
      cancel: { color: 'negative', outline: true },
    }).onOk(() => {
      autoGenerateForm(newValue)
    })
  }
})

const unselectAll = () => {
  if (editor.active && !props.preview) {
    editor.unselectAll()
  }
}
</script>

<style scoped lang="sass">
.form-component
  width: 90%
  height: 30px
</style>

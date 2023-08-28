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
            <div
              v-if="value.type === '$separator'"
              class="row q-pa-xs q-my-sm bg-grey-8 items-center"
            >
              <div class="col-auto">
                <q-icon
                  :name="componentIcon(value)"
                  :color="componentColor(value)"
                  size="sm"
                />
              </div>

              <div class="col q-ml-sm">
                <span :class="`text-${componentColor(value)} text-bold`">
                  {{ componentLabel(value) }}
                </span>
              </div>
            </div>

            <q-btn
              v-else-if="value.type !== ''"
              class="form-component q-mx-sm"
              :icon="componentIcon(value)"
              :label="componentLabel(value)"
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
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { formSchema } from '@/shared/schemas/form'
import { tableFieldSchema } from '@/shared/schemas/table'
import { AnyData } from '@/shared/interfaces/commons'
import { useAppEditor } from '@/features/App/store'
import { stringValue } from '@/composites/utilities'
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

const { t } = useI18n()

const fields = useModelValue(props, emit)

const visibleComponents = computed(() => props.components.filter((c) => !c.hidden))

/**
 * Selection
 */

const editor = useAppEditor()

const cloneComponent = (component: TFormComponent): TFormField | undefined => editor.createFormField(component)

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
      title: t('form.dialog.autogenerate.title'),
      persistent: true,
      message: t('form.dialog.autogenerate.message'),
      ok: {
        label: t('dialog.ok'),
        color: 'green',
        outline: true,
      },
      cancel: {
        label: t('dialog.ok'),
        color: 'negative',
        outline: true,
      },
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

const componentColor = (c: TFormComponent) => stringValue(c?.color)

const componentIcon = (c: TFormComponent) => stringValue(c?.icon)

const componentLabel = (c: TFormComponent) => stringValue(c?.label)
</script>

<style scoped lang="sass">
.form-component
  width: 90%
  height: 30px
</style>

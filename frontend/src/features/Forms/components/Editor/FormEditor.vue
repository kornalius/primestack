<template>
  <div @click="unselectAll">
    <div class="row">
      <div class="col-auto">
        <q-list class="drawer" dense>
          <draggable
            :list="visibleComponents"
            :item-key="(value) => visibleComponents.indexOf(value)"
            :clone="cloneComponent"
            :group="{
              name: 'form-builder',
              pull: 'clone',
              put: false,
            }"
            filter=".overlay,[disabled]"
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
                    {{ $t(componentLabel(value)) }}
                  </span>
                </div>
              </div>

              <q-btn
                v-else-if="value.type !== ''"
                class="form-component q-mx-sm"
                :icon="componentIcon(value)"
                :label="$t(componentLabel(value))"
                :disabled="!isComponentAvailable(value.type, auth.user._plan.code)"
                type="button"
                size="12px"
                align="left"
                dense
                no-caps
                flat
                @click="editor.addFieldToForm(value)"
              >
                <q-icon
                  v-if="!isComponentAvailable(value.type, auth.user._plan.code)"
                  name="mdi-currency-usd"
                  color="red-9"
                  size="xs"
                />
                <q-tooltip :delay="500">
                  {{ $t(componentLabel(value)) }}
                </q-tooltip>
              </q-btn>
            </template>
          </draggable>
        </q-list>
      </div>

      <div class="col container q-pa-sm">
        <fields-editor v-model="fields" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import draggable from 'vuedraggable'
import { TFormComponent } from '@/shared/interfaces/forms'
import { useModelValue } from '@/composites/prop'
import { columnSchema, fieldSchema, formSchema } from '@/shared/schemas/form'
import { useAppEditor } from '@/features/Editor/store'
import { useFormElements } from '@/features/Forms/composites'
import { stringValue } from '@/composites/utilities'
import { isComponentAvailable } from '@/shared/plan'
import { useAuth } from '@/features/Auth/store'
import FieldsEditor from './FieldsEditor.vue'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

const props = defineProps<{
  modelValue: unknown[]
  form: Form
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const auth = useAuth()

const quasar = useQuasar()

const { t } = useI18n()

const fields = useModelValue(props, emit)

const editor = useAppEditor()

const { autoGenerateForm, components } = useFormElements()

const visibleComponents = computed(() => components.filter((c) => !c.hidden))

/**
 * Selection
 */

const cloneComponent = (component: TFormComponent): FormField | FormColumn | undefined => (
  editor.createFormField(component)
)

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
        label: t('dialog.cancel'),
        color: 'negative',
        outline: true,
      },
    }).onOk(() => {
      autoGenerateForm(newValue)
    })
  }
})

const unselectAll = () => {
  if (editor.active && !editor.preview && !editor.actionId) {
    editor.unselectAll()
  }
  if (editor.active && editor.actionId) {
    editor.unselectAll()
    editor.unselectActionElement()
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

.drawer
  overflow: auto
  width: 200px
  height: calc(100vh - 118px)

.container
  overflow: auto
  width: 100%
  height: calc(100vh - 118px)
</style>

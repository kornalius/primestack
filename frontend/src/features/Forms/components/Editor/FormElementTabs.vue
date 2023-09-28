<template>
  <tabs-editor
    v-model="field._columns"
    v-model:tab="active"
    v-bind="fieldBinds(field, schemaForField(field), ctx)"
  />

  <div class="panels">
    <q-tab-panels
      :model-value="active"
      style="z-index: 1;"
      :vertical="field.vertical"
      animated
    >
      <q-tab-panel
        v-for="t in field._columns"
        :key="t._id"
        :name="t._id"
        @click.stop="$emit('click')"
      >
        <fields-editor v-model="t._fields" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { fieldSchema } from '@/shared/schemas/form'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '@/features/Forms/composites'
import { useAppEditor } from '@/features/App/editor-store'
import TabsEditor from '@/features/Tabs/components/TabsEditor.vue'
import FieldsEditor from '@/features/Forms/components/Editor/FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: FormField
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: FormField): void,
  (e: 'click'): void,
}>()

const field = useModelValue(props, emit)

const {
  fieldBinds,
  schemaForField,
} = useFormElements()

const { buildCtx } = useExpression()

const ctx = buildCtx()

/**
 * Active tab
 */

const active = ref() as Ref<string>

// eslint-disable-next-line no-underscore-dangle
watch(() => field.value._columns, () => {
  // when no active tab, select the first one if possible
  if (!active.value) {
    // eslint-disable-next-line no-underscore-dangle
    active.value = field.value?._columns?.[0]?._id
  }
}, { immediate: true })

const editor = useAppEditor()

watch(active, () => {
  editor.select(active.value)
})
</script>

<style scoped lang="sass">
.panels
  min-height: 64px
</style>

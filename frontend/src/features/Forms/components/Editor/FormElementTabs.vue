<template>
  <tabs-editor
    v-model="field._columns"
    v-model:tab="active"
    :class="{
      toolbar: true,
      ...(component?.editClasses || {}),
      ...classBinds(field),
    }"
    :style="{
      ...(component?.editStyles || {}),
      ...styleBinds(field),
    }"
    v-bind="{ ...fieldBinds(field, schemaForField(field), ctx), ...$attrs }"
    @click-tab="(tab) => editor.select(tab._id)"
  />

  <div class="panels">
    <q-tab-panels
      :model-value="active"
      style="z-index: 1;"
      :vertical="field.vertical"
      animated
    >
      <q-tab-panel
        v-for="c in field._columns"
        :key="c._id"
        :name="c._id"
        @click.stop="$emit('click')"
      >
        <fields-editor v-model="c._fields" />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import {
  computed, Ref, ref, watch,
} from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
// eslint-disable-next-line import/no-cycle
import { fieldSchema } from '@/shared/schemas/form'
import { useExpression } from '@/features/Expression/composites'
import { useFormElements } from '@/features/Forms/composites'
import { useAppEditor } from '@/features/Editor/store'
import TabsEditor from '@/features/Tabs/components/TabsEditor.vue'
import FieldsEditor from '@/features/Forms/components/Editor/FieldsEditor.vue'

type FormField = Static<typeof fieldSchema>

const props = defineProps<{
  modelValue: FormField
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: FormField): void,
  (e: 'click'): void,
}>()

const field = useModelValue(props, emit)

const {
  componentsByType,
  fieldBinds,
  classBinds,
  styleBinds,
  schemaForField,
} = useFormElements()

const { t } = useI18n()

const { buildCtx } = useExpression(t)

const ctx = buildCtx()

const component = computed(() => (
  // eslint-disable-next-line no-underscore-dangle
  componentsByType[field.value._type]
))

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

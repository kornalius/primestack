<template>
  <div
    v-for="field in fields"
    :key="field._id"
    class="q-mb-sm"
  >
    <div>
      <form-display-row
        v-if="isRow(field)"
        v-model="value"
        :field="field"
        :columns="field._columns"
        :components="components"
      />

      <form-display-card
        v-else-if="isCard(field)"
        v-model="value"
        v-bind="fieldBinds(field, schemaForType(field))"
        :field="field"
        :columns="field._columns"
        :components="components"
      />

      <div
        v-else-if="isParagraph(field)"
        v-html="value[field.field]"
      />

      <component
        :is="componentForField(field)"
        v-else-if="isNumericInput(field)"
        v-model.number="value[field.field]"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
      />

      <component
        :is="componentForField(field)"
        v-else
        v-model="value[field.field]"
        v-bind="fieldBinds(field, schemaForType(field))"
        :style="style(field)"
        :rules="serializeRules(t, field)"
        lazy-rules
        @click="callEventAction(field.click as string)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useModelValue } from '@/composites/prop'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { useFeathers } from '@/composites/feathers'
import useSnacks from '@/features/Snacks/store'
import useVariables from '@/features/Variables/store'
import useActions from '@/features/Actions/composites'
import useFormElements from '../composites'
import FormDisplayRow from './FormDisplayRow.vue'
import FormDisplayCard from './FormDisplayCard.vue'

const props = defineProps<{
  modelValue: Record<string, unknown>
  fields: TFormField[]
  components: TFormComponent[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Record<string, unknown>): void,
}>()

const {
  componentForField,
  fieldBinds,
  style,
  isNumericInput,
  schemaForType,
  isRow,
  isCard,
  isParagraph,
  serializeRules,
} = useFormElements()

const value = useModelValue(props, emit)

const { t } = useI18n()

const quasar = useQuasar()

const { api } = useFeathers()

const { exec } = useActions()

const snacks = useSnacks()

const userActions = api.service('actions').findOneInStore({ query: {} })?.value.list

const store = useVariables()

const callEventAction = (id: string) => {
  const act = userActions.find((a) => a._id === id)
  if (act) {
    // eslint-disable-next-line no-underscore-dangle
    exec(act._actions, {
      quasar,
      api,
      snacks,
      store,
    })
  }
}
</script>

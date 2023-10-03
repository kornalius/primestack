<template>
  <div class="row items-center q-gutter-sm">
    <div class="col-4">
      <table-field-select
        v-model="field.fieldId"
        :disable="disable"
        :fields="fields"
        :label="$t('query.fieldname')"
        options-dense
        clearable
        dense
        outlined
        @keydown="editor.preventSystemUndoRedo"
      />
    </div>

    <div class="col-2">
      <q-select
        v-if="showOps"
        v-model="field.op"
        :disable="disable"
        :options="operators"
        options-dense
        dense
        outlined
        @keydown="editor.preventSystemUndoRedo"
      />
    </div>

    <div class="col">
      <div v-if="showValue">
        <!-- Expression -->

        <div
          v-if="isExpr(field.value)"
          class="overflow-hidden ellipsis"
          style="max-width: 175px;"
        >
          <property-highlight
            :model-value="exprCode(field.value)"
            language="javascript"
          />
        </div>

        <q-input
          v-else-if="fieldType === 'string'"
          v-model="field.value"
          :label="$t('query.value')"
          clearable
          dense
          outlined
          @keydown="editor.preventSystemUndoRedo"
        />

        <q-input
          v-else-if="fieldType === 'number'"
          v-model.number="field.value"
          :label="$t('query.value')"
          type="number"
          dense
          outlined
          @keydown="editor.preventSystemUndoRedo"
        />

        <q-checkbox
          v-else-if="fieldType === 'boolean'"
          v-model="field.value"
          dense
        />
      </div>
    </div>

    <div class="col-auto" style="width: 20px;">
      <q-btn
        v-if="showExpr"
        class="q-mr-sm"
        icon="mdi-flash"
        :color="isExpr(field.value) ? 'orange-8' : 'grey-5'"
        size="sm"
        flat
        dense
      >
        <q-popup-edit
          v-model="field.value"
          :title="`${fieldname} Expression...`"
          auto-save
          @before-show="loadExpr"
          @before-hide="saveExpr"
        >
          <code-editor
            v-model="field.value"
            style="width: 600px; height: 150px;"
            lang-js
            autofocus
            @keydown="editor.preventSystemUndoRedo"
          />
        </q-popup-edit>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { Static, TSchema } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import { tableFieldSchema } from '@/shared/schemas/table'
import { defaultValueForSchema, validForExpr } from '@/shared/schema'
import { QueryCriteria } from '@/shared/interfaces/query'
import { useAppEditor } from '@/features/App/editor-store'
import { useExpression } from '@/features/Expression/composites'
import TableFieldSelect from '@/features/Tables/components/TableFieldSelect.vue'
import CodeEditor from '@/features/Expression/components/CodeEditor.vue'
import PropertyHighlight from '@/features/Properties/components/PropertyHighlight.vue'

type TableFieldSchema = Static<typeof tableFieldSchema>

const props = defineProps<{
  modelValue: QueryCriteria
  disable?: boolean
  fields: TableFieldSchema[]
  operators: string[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: QueryCriteria): void,
}>()

const field = useModelValue(props, emit)

const editor = useAppEditor()

const { isExpr, exprCode, stringToExpr } = useExpression()

const selectedField = computed(() => (
  props.fields.find((f) => f._id === field.value.fieldId)
))

const fieldType = computed((): string => selectedField.value?.type as string)

const fieldname = computed(() => selectedField.value.name)

const showOps = computed(() => selectedField.value && fieldType.value !== 'boolean')

const showValue = computed(() => selectedField.value)

/**
 * Should we show the expression button next to the property?
 */
const showExpr = computed((): boolean => (
  validForExpr.indexOf(fieldType.value) !== -1
))

watch(() => field.value.fieldId, () => {
  if (!field.value.value) {
    field.value.value = defaultValueForSchema({ type: fieldType.value } as TSchema)
  }
}, { immediate: true })

/**
 * Convert the property value expression into the code editor
 */
const loadExpr = () => {
  if (isExpr(field.value.value)) {
    field.value.value = exprCode(field.value.value)
  }
}

/**
 * Convert the expression from the code editor back into the property value
 */
const saveExpr = () => {
  if (field.value.value !== '') {
    field.value.value = stringToExpr(field.value.value)
  }
}
</script>

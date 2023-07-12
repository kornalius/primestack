<template>
  <div>
    <div class="text-h2 q-mb-md">
      Test
    </div>

    <!--    <q-drawer-->
    <!--      :model-value="rightDrawerOpen"-->
    <!--      side="right"-->
    <!--      bordered-->
    <!--    >-->
    <!--      &lt;!&ndash; drawer content &ndash;&gt;-->
    <!--    </q-drawer>-->

    <q-tabs
      v-model="tab"
      align="justify"
      dense
      narrow-indicator
    >
      <q-tab name="ArrayEditor" label="Array Editor" />
      <q-tab name="PropertiesEditor" label="Properties Editor" />
      <q-tab name="FormEditor" label="Form Editor" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="ArrayEditor">
        <array-editor
          v-model="testArray"
          v-model:valid="valid"
          v-model:selection="selection"
          class="q-mb-sm"
          :item-key="(value) => value as string"
          :add-function="addItem"
          :remove-function="removeItem"
          :height="300"
          :min="1"
          :max="3"
          add-label="New"
          clear-label="Clear"
          clearable
          reorderable
          selectable
          @select="onSelect"
          @clear="() => { testArray.length = 0 }"
        >
          <template #default="{ value, hover }">
            <div :style="{ background: hover ? 'whitesmoke' : '' }">
              {{ value }}
            </div>
          </template>
        </array-editor>

        <div v-if="valid">
          Array is valid
        </div>

        <div>Selection</div>

        <pre>{{ selection }}</pre>

        <pre>{{ testArray }}</pre>
      </q-tab-panel>

      <q-tab-panel name="PropertiesEditor">
        <properties-editor
          v-model="testProperties"
          v-model:forced-types="forcedTypes"
          :prop-name="''"
          :schema="schema"
        />

        <pre>{{ testProperties }}</pre>
        <pre>{{ forcedTypes }}</pre>
      </q-tab-panel>

      <q-tab-panel name="FormEditor" class="q-pr-none">
        <div class="row">
          <div class="title q-mb-sm full-width">
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
        </div>

        <form-display
          v-if="preview"
          v-model="previewFormData"
          :fields="testForm"
          :components="components"
        />

        <form-editor
          v-else
          v-model="testForm"
          :components="components"
        />

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
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { Ref, ref, watch } from 'vue'
import { Type } from '@feathersjs/typebox'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import FormEditor from '@/features/Form/components/Editor/FormEditor.vue'
import PropertiesEditor from '@/features/Properties/components/PropertiesEditor.vue'
import useFormElements from '@/features/Form/composites'
import FormDisplay from '@/features/Form/components/FormDisplay.vue'
import { defaultValueForSchema } from '@/utils/schemas'
import { TFormField } from '@/shared/interfaces/forms'

const testProperties = ref({
  string: '',
  number: 0,
  range: 5,
  date: '',
  time: '',
  boolean: false,
  select: '',
  multipleSelect: [],
  color: '',
  arrayOfString: [],
  arrayOfObject: [],
  obj: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
})

const forcedTypes = ref({})

const schema = Type.Object({
  string: Type.Union([Type.String(), Type.Number()]),
  number: Type.Number(),
  range: Type.Number({ minimum: 0, maximum: 10, step: 0.5 }),
  date: Type.String({ format: 'date' }),
  time: Type.String({ format: 'time' }),
  boolean: Type.Boolean(),
  select: Type.String({
    options: [
      {
        label: 'Quebec',
        value: 'QC',
      },
      {
        label: 'Ontario',
        value: 'ON',
      },
      {
        label: 'British Columbia',
        value: 'BC',
      },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  }),
  multipleSelect: Type.Array(Type.String({
    options: [
      {
        label: 'Quebec',
        value: 'QC',
      },
      {
        label: 'Ontario',
        value: 'ON',
      },
      {
        label: 'British Columbia',
        value: 'BC',
      },
    ],
    optionValue: 'value',
    optionLabel: 'label',
  })),
  color: Type.String({ color: true }),
  arrayOfString: Type.Array(Type.Union([Type.String(), Type.Number()])),
  arrayOfObject: Type.Array(Type.Object({
    string: Type.Union([Type.String(), Type.Number()]),
    check: Type.Boolean(),
  })),
  obj: Type.Object({
    string: Type.Union([Type.String(), Type.Number()]),
    top: Type.Number(),
    left: Type.Number(),
    bottom: Type.Number(),
    right: Type.Number(),
  }),
})

// eslint-disable-next-line no-console
console.log(schema)

const tab = ref('ArrayEditor')

const testArray = ref(['item #1', 'item #2'])

const addItem = (): unknown | undefined => {
  const newValue = `Item #${testArray.value.length + 1}`
  testArray.value.push(newValue)
  return newValue
}

const removeItem = (value, index): boolean => {
  testArray.value.splice(index, 1)
  return true
}

const valid = ref(false)

const selection = ref([])

const onSelect = (value: unknown, selected: boolean) => {
  // eslint-disable-next-line no-console
  console.log('select', value, selected)
}
/**
 * Form
 */

const testForm = ref([]) as Ref<TFormField[]>

const components = ref(useFormElements().components)

/**
 * Preview
 */

const { flattenFields } = useFormElements()

const preview = ref(false)
const previewFormData = ref({})
const showPreviewFormData = ref(false)

watch(preview, () => {
  previewFormData.value = flattenFields(testForm.value)
    .reduce((acc, f) => {
      // eslint-disable-next-line no-underscore-dangle
      const comp = components.value.find((c) => c.type === f._type)
      if (comp && !comp.nokey) {
        return { ...acc, [f.name]: defaultValueForSchema(comp.schema.properties.modelValue) }
      }
      return acc
    }, {})
})
</script>

<style scoped lang="sass">
.title
  padding: 4px 8px
  background: $grey-6
</style>

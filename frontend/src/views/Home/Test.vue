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
        <property-editor v-model="testProperties" :schema="schema" />

        <pre>{{ testProperties }}</pre>
      </q-tab-panel>

      <q-tab-panel name="FormEditor">
        <form-editor
          v-model="testForm"
          :components="components"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Type } from '@feathersjs/typebox'
import PropertyEditor from '@/features/Properties/components/PropertiesEditor.vue'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import FormEditor from '@/features/Form/components/FormEditor.vue'
import useFormElements from '@/features/Form/composites'

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
})

const schema = Type.Object({
  string: Type.String(),
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
  arrayOfString: Type.Array(Type.String()),
  arrayOfObject: Type.Array(Type.Object({
    string: Type.String(),
    check: Type.Boolean(),
  })),
})

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

const testForm = ref([])

const components = ref(useFormElements().components)
</script>

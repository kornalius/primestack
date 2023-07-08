<template>
  <div>
    <div class="text-h2 q-mb-md">
      Test
    </div>

    <q-drawer
      :model-value="rightDrawerOpen"
      side="right"
      bordered
    >
      <!-- drawer content -->
    </q-drawer>

    <div v-if="valid">
      Array is valid
    </div>

    <array-editor
      v-model="testArray"
      v-model:valid="valid"
      class="q-mb-sm"
      :add-function="addItem"
      :remove-function="removeItem"
      :height="300"
      :min="1"
      :max="3"
      add-label="New"
      clear-label="Clear"
      clearable
      reorderable
      @clear="() => { testArray.length = 0 }"
    >
      <template #default="{ value, hover }">
        <div :style="{ background: hover ? 'whitesmoke' : '' }">
          {{ value }}
        </div>
      </template>
    </array-editor>

    <pre>{{ testArray }}</pre>

    <property-editor :model-value="test" :schema="schema" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PropertyEditor from '@/features/Properties/components/PropertiesEditor.vue'
import { Type } from '@feathersjs/typebox'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'

const rightDrawerOpen = ref(true)

const test = ref({
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

const testArray = ref(['item #1', 'item #2'])

const addItem = (): unknown | undefined => {
  const newValue = `Item #${testArray.value.length + 1}`
  testArray.value.push(newValue)
  return newValue
}

const removeItem = (index): boolean => {
  testArray.value.splice(index, 1)
  return true
}

const valid = ref(false)

console.log(schema)
</script>

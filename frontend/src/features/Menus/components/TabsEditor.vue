<template>
  <div>
    <array-editor
      v-model="value"
      :add-function="addTab"
      :remove-function="removeTab"
      add-button="bottom"
      reorderable
    >
      <template #default="{ index }">
        <div class="row q-gutter-sm items-center">
          <div class="col-3">
            <q-input
              v-model="value[index].label"
              label="Label"
              dense
              outlined
            />
          </div>

          <div class="col-2">
            <icon-field
              v-model="value[index].icon"
              label="Icon"
              no-label
              dense
              outlined
            />
          </div>

          <div class="col-2">
            <color-field
              v-model="value[index].color"
              label="Color"
              quasar-palette
              dense
              outlined
            />
          </div>

          <div class="col">
            <q-select
              v-model="value[index].formId"
              :options="forms"
              label="Form"
              option-value="_id"
              option-label="name"
              options-dense
              clearable
              emit-value
              map-options
              dense
              outlined
            />
          </div>
        </div>
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { tabSchema } from '@/shared/schemas/menu'
import { api } from '@/plugins/pinia'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'

type Schema = Static<typeof tabSchema>

const props = defineProps<{
  modelValue: Schema
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Schema): void,
}>()

const value = useModelValue(props, emit)

const addTab = () => {
  const tab: Schema = {
    _id: hexObjectId(),
    label: undefined,
    icon: undefined,
    color: undefined,
    formId: undefined,
  }
  value.value.push(tab)
}

const removeTab = (v: Schema, index: number): boolean => {
  value.value.splice(index, 1)
  return true
}

const { data: forms, find } = api.service('forms').useFind({
  query: {},
})
find()
</script>

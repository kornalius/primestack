<template>
  <div>
    <array-editor
      v-model="value"
      :add-function="addMenu"
      :remove-function="removeMenu"
      add-button="bottom"
      reorderable
    >
      <template #default="{ index }">
        <div class="row q-gutter-sm q-mb-md items-center">
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

          <div class="col-3">
            <q-input
              v-model="value[index].href"
              label="href"
              dense
              outlined
            />
          </div>

          <div class="col">
            <q-select
              v-model="value[index].target"
              :options="targetValues"
              label="target"
              emit-value
              options-dense
              dense
              outlined
            />
          </div>
        </div>

        <section-title title="TABS" />

        <tabs-editor v-model="value[index].tabs" />
      </template>
    </array-editor>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { useModelValue } from '@/composites/prop'
import { schema, targetValues } from '@/shared/schemas/menu'
import ArrayEditor from '@/features/Array/components/ArrayEditor.vue'
import SectionTitle from '@/features/Fields/components/SectionTitle.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import TabsEditor from '@/features/Menus/components/TabsEditor.vue'

type Schema = Static<typeof schema>

const props = defineProps<{
  modelValue: Schema
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'update:model-value', value: Schema): void,
}>()

const value = useModelValue(props, emit)

const addMenu = () => {
  const menu: Schema = {
    _id: hexObjectId(),
    label: undefined,
    icon: undefined,
    color: undefined,
    href: undefined,
    target: '_self',
    tabs: [],
  }
  value.value.push(menu)
}

const removeMenu = (v: Schema, index: number): boolean => {
  value.value.splice(index, 1)
  return true
}
</script>

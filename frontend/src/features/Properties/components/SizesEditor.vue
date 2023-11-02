<template>
  <div>
    <div class="sizes row items-center justify-center q-mb-xs">
      <div class="col-auto">
        <unit-input
          v-model="value.width"
          class="field"
          :units="units"
          label="width"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>

      <div class="col-auto">
        <q-icon name="mdi-close" size="xs" />
      </div>

      <div class="col-auto">
        <unit-input
          v-model="value.height"
          class="field"
          :units="units"
          label="height"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row items-center justify-center q-mb-xs">
      <div class="col-auto">
        <unit-input
          v-model="value.minWidth"
          class="field"
          :units="units"
          label="min width"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>

      <div class="col-auto">
        <q-icon name="mdi-close" size="xs" />
      </div>

      <div class="col-auto">
        <unit-input
          v-model="value.maxWidth"
          class="field"
          :units="units"
          label="max width"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row items-center justify-center">
      <div class="col-auto">
        <unit-input
          v-model="value.minHeight"
          class="field"
          :units="units"
          label="min height"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>

      <div class="col-auto">
        <q-icon name="mdi-close" size="xs" />
      </div>

      <div class="col-auto">
        <unit-input
          v-model="value.maxHeight"
          class="field"
          :units="units"
          label="max height"
          default-unit="px"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { useAppEditor } from '@/features/Editor/store'
import UnitInput from '@/features/Fields/components/UnitInput.vue'

const props = defineProps<{
  modelValue: AnyData
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()

const units = [
  { label: 'px', value: 'px' },
  { label: '%', value: '%' },
  { label: 'rem', value: 'rem' },
]
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.sizes
  border: 1px solid $grey-9
  background: $blue-grey-2
  border-radius: 4px
  padding: 4px

.field
  width: 96px
</style>

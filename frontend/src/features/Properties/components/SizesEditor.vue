<template>
  <div>
    <div class="sizes row items-center justify-center q-mb-xs">
      <div class="col-auto">
        <q-input
          v-model="value.width"
          class="field"
          label="width"
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
        <q-input
          v-model="value.height"
          class="field"
          label="height"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row items-center justify-center q-mb-xs">
      <div class="col-auto">
        <q-input
          v-model="value.minWidth"
          class="field"
          label="min width"
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
        <q-input
          v-model="value.maxWidth"
          class="field"
          label="max width"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row items-center justify-center">
      <div class="col-auto">
        <q-input
          v-model="value.minHeight"
          class="field"
          label="min height"
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
        <q-input
          v-model="value.maxHeight"
          class="field"
          label="max height"
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
import { useAppEditor } from '@/features/Editor/editor-store'

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modelValue: AnyData
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: AnyData): void,
}>()

const value = useModelValue(props, emit)

const editor = useAppEditor()
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.sizes
  border: 1px solid $grey-9
  background: $blue-grey-2
  border-radius: 4px
  padding: 4px

.field
  width: 78px
</style>

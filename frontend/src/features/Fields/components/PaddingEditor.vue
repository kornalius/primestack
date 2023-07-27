<template>
  <div class="padding">
    <div class="row justify-center">
      <div class="col-auto">
        <q-input
          v-model="value.top"
          class="field"
          label="top"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row">
      <div class="col-auto">
        <q-input
          v-model="value.left"
          class="field"
          label="left"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>

      <div class="col middle" />

      <div class="col-auto">
        <q-input
          v-model="value.right"
          class="field"
          label="right"
          hide-bottom-space
          outlined
          dense
          @keydown="editor.preventSystemUndoRedo"
        />
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-auto align-center">
        <q-input
          v-model="value.bottom"
          class="field"
          label="bottom"
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
import useAppEditor from '@/features/App/store'

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
.padding
  border: 1px solid $grey-9
  background: $blue-grey-2
  border-radius: 4px
  padding: 4px

.field
  width: 78px

.middle
  margin: 4px
  background: $blue-grey-4
</style>

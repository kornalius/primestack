<template>
  <div>
    <div
      v-if="emptyMessage && actionList.length === 0 && !editor.isDragging"
      class="text-italic text-grey-8"
    >
      {{ emptyMessage }}
    </div>

    <draggable
      :list="actionList"
      class="action-builder-container"
      style="padding-bottom: 12px;"
      :group="{ name: 'actions-builder' }"
      :animation="150"
      easing="cubic-bezier(1, 0, 0, 1)"
      item-key="_id"
      @start="editor.setDragging(true)"
      @end="editor.setDragging(false)"
      @change="onChange"
    >
      <template #item="{ index }">
        <action-element
          v-model="actionList[index]"
          :selected="editor.isActionElementSelected(actionList[index]._id)"
          @click="editor.selectActionElement"
          @remove="remove"
        />
      </template>
    </draggable>
  </div>
</template>

<script setup lang="ts">
import { Static } from '@feathersjs/typebox'
import draggable from 'vuedraggable'
import { useAppEditor } from '@/features/App/editor-store'
import { useModelValue } from '@/composites/prop'
import { actionElementSchema } from '@/shared/schemas/actions'
import { AnyData } from '@/shared/interfaces/commons'
import ActionElement from './ActionElement.vue'

type Action = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: Action[]
  emptyMessage?: string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'moved', oldIndex: number, newIndex: number): void,
  (e: 'select', value: unknown): void,
  (e: 'update:model-value', value: Action[]): void,
}>()

const actionList = useModelValue(props, emit)

/**
 * Selection
 */

const editor = useAppEditor()

const remove = (action: Action) => {
  const idx = actionList.value.findIndex((v) => v._id === action._id)
  if (idx !== -1) {
    actionList.value.splice(idx, 1)
  }
}

/**
 * Draggable
 */

const onChange = (evt: AnyData) => {
  if (evt.added) {
    editor.select(evt.added.element._id)
  }
}
</script>

<style scoped lang="sass">
.action-builder-container
  min-height: 24px
</style>

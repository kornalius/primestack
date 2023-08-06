<template>
  <q-layout view="hHh lpr lFr">
    <q-drawer
      :model-value="true"
      class="q-pa-sm"
      :width="180"
      side="left"
      behavior="desktop"
      show-if-above
      bordered
    >
      <q-list class="Drawer" dense>
        <draggable
          :list="visibleActions"
          :item-key="(value) => visibleActions.indexOf(value)"
          :clone="cloneAction"
          :group="{
            name: 'actions-builder',
            pull: 'clone',
            put: false,
          }"
          :sort="false"
          @start="editor.setDragging(true)"
          @end="editor.setDragging(false)"
        >
          <template #item="{ element: value }">
            <q-btn
              v-if="value.type !== ''"
              class="action-button q-mx-sm"
              type="button"
              size="12px"
              align="left"
              dense
              flat
              @click="editor.addActionElement(value, true)"
            >
              <q-tooltip :delay="500">
                {{ actionDescription(value) }}
              </q-tooltip>

              <q-icon :name="actionIcon(value)" :color="actionIconColor(value)" />
              <span class="q-ml-sm">{{ actionLabel(value) }}</span>
            </q-btn>
          </template>
        </draggable>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page
        class="q-pa-sm"
        @click="unselectAll"
      >
        <div class="row items-center q-mb-md">
          <div class="col">
            Actions
          </div>

          <q-space />

          <div class="col-auto">
            <q-btn
              icon="mdi-close"
              size="sm"
              flat
              round
              @click="editor.setActionId(undefined)"
            />
          </div>
        </div>

        <actions-list-editor
          v-model="actionList"
          :actions="actions"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import draggable from 'vuedraggable'
import useAppEditor from '@/features/App/store'
import { TAction } from '@/shared/interfaces/actions'
import { useModelValue } from '@/composites/prop'
import { actionElementSchema } from '@/shared/schemas/actions'
import ActionsListEditor from './ActionsListEditor.vue'

type ActionElement = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: ActionElement[]
  actions: TAction[]
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const actionList = useModelValue(props, emit)

const visibleActions = computed(() => props.actions.filter((a) => !a.hidden))

const editor = useAppEditor()

const cloneAction = (action: TAction) => editor.createActionElement(action)

const unselectAll = () => {
  if (editor.active) {
    editor.unselectAll()
  }
}

const actionIconColor = (action: TAction) => {
  if (typeof action.iconColor === 'function') {
    return action.iconColor()
  }
  if (action.iconColor) {
    return action.iconColor
  }
  if (typeof action.color === 'function') {
    return action.color()
  }
  return action.color
}

const actionDescription = (action: TAction) => {
  if (typeof action.description === 'function') {
    return action.description()
  }
  return action.description
}

const actionIcon = (action: TAction) => {
  if (typeof action.icon === 'function') {
    return action.icon()
  }
  return action.icon
}

const actionLabel = (action: TAction) => {
  if (typeof action.label === 'function') {
    return action.label()
  }
  return action.label
}
</script>

<style scoped lang="sass">
.action-button
  width: 90%
  height: 30px
</style>

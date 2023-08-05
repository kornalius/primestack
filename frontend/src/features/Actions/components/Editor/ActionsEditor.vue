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
          filter=".overlay"
          :sort="false"
          @start="editor.setDragging(true)"
          @end="editor.setDragging(false)"
        >
          <template #item="{ element: value }">
            <q-btn
              v-if="value.type !== ''"
              class="action-button q-mx-sm"
              :icon="value.icon"
              :label="value.label"
              :color="value.color"
              type="button"
              size="12px"
              align="left"
              dense
              flat
              @click="editor.addActionElement(value)"
            />
          </template>
        </draggable>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page
        class="q-pa-sm"
        @click="unselectAll"
      >
        <div class="row items-center">
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

type Action = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: Action[]
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

const cloneAction = (action: TAction) => editor.addActionElement(action)

const unselectAll = () => {
  if (editor.active) {
    editor.unselectAll()
  }
}
</script>

<style scoped lang="sass">
.action-button
  width: 90%
  height: 30px
</style>

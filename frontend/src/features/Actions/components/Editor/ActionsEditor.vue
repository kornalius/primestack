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
          filter="[disabled]"
          @start="editor.setDragging(true)"
          @end="editor.setDragging(false)"
        >
          <template #item="{ element: value }">
            <div
              v-if="value.type === '$separator'"
              class="row q-pa-xs q-my-sm bg-grey-8 items-center"
            >
              <div class="col-auto">
                <q-icon
                  :name="actionIcon(value)"
                  :color="actionIconColor(value)"
                  size="sm"
                />
              </div>

              <div class="col q-ml-sm">
                <span :class="`text-${actionColor(value)} text-bold`">
                  {{ actionLabel(value) }}
                </span>
              </div>
            </div>

            <q-btn
              v-else-if="value.type !== ''"
              class="action-button q-mx-sm align-center"
              :disabled="!isActionAvailable(value.type, auth.user._plan.code)"
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

              <q-icon
                v-if="!isActionAvailable(value.type, auth.user._plan.code)"
                name="mdi-currency-usd"
                color="red-9"
                size="xs"
              />
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
import { useAppEditor } from '@/features/App/editor-store'
import { TAction } from '@/shared/interfaces/actions'
import { useModelValue } from '@/composites/prop'
import { actionElementSchema } from '@/shared/schemas/actions'
import { TFrontAction } from '@/features/Actions/interface'
import { stringValue } from '@/composites/utilities'
import { useAuth } from '@/features/Auth/store'
import { isActionAvailable } from '@/shared/plan'
import ActionsListEditor from './ActionsListEditor.vue'

type ActionElement = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: ActionElement[]
  actions: TFrontAction[]
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

const auth = useAuth()

const editor = useAppEditor()

const cloneAction = (action: TAction) => editor.createActionElement(action)

const unselectAll = () => {
  if (editor.active) {
    editor.unselectAll()
  }
}

const actionColor = (action: TFrontAction) => stringValue(action?.color, action)

const actionIconColor = (action: TFrontAction) => stringValue(action?.iconColor, action)

const actionDescription = (action: TAction) => stringValue(action?.description, action)

const actionIcon = (action: TFrontAction) => stringValue(action?.icon, action)

const actionLabel = (action: TFrontAction) => stringValue(action?.label, action)
</script>

<style scoped lang="sass">
.action-button
  width: 90%
  height: 30px
</style>

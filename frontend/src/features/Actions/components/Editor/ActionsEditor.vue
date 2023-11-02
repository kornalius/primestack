<template>
  <div class="row">
    <div class="col-auto">
      <q-list class="drawer" dense>
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
                  {{ $t(actionLabel(value)) }}
                </span>
              </div>
            </div>

            <q-btn
              v-else-if="value.type !== ''"
              class="action-button q-mx-sm align-center"
              :disabled="!isActionAvailable(value.type, auth.user._plan.code)"
              type="button"
              size="13px"
              align="left"
              no-caps
              dense
              flat
              @click="editor.addActionElement(value, true)"
            >
              <q-tooltip :delay="500">
                {{ $t(actionDescription(value)) }}
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
    </div>

    <div
      class="col container q-pa-sm"
      @click="() => editor.unselectActionElement()"
    >
      <div class="row title items-center q-pa-xs q-mb-sm">
        <div class="col-auto">
          <span class="text-caption text-weight-medium" style="font-size: 20px;">
            {{ title }}
          </span>
        </div>

        <q-space />

        <div class="col-auto">
          <q-btn
            icon="mdi-close"
            size="sm"
            color="white text-black"
            round
            @click.stop="close"
          />
        </div>
      </div>

      <actions-list-editor v-model="actionList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, onBeforeUnmount, ref,
} from 'vue'
import { Static } from '@feathersjs/typebox'
import draggable from 'vuedraggable'
import { useAppEditor } from '@/features/Editor/store'
import { useAuth } from '@/features/Auth/store'
import { useActions } from '@/features/Actions/composites'
import { useModelValue } from '@/composites/prop'
import { useFormElements } from '@/features/Forms/composites'
import { actionElementSchema } from '@/shared/schemas/actions'
import { TAction } from '@/shared/interfaces/actions'
import { TFrontAction } from '@/features/Actions/interface'
import { stringValue } from '@/composites/utilities'
import { isActionAvailable } from '@/shared/plan'
import ActionsListEditor from './ActionsListEditor.vue'

type ActionElement = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: ActionElement[]
}>()

const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

const actionList = useModelValue(props, emit)

const auth = useAuth()

const editor = useAppEditor()

const { actions } = useActions()

const { componentsByType, argNames } = useFormElements()

const visibleActions = computed(() => actions.filter((a) => !a.hidden))

const cloneAction = (action: TAction) => editor.createActionElement(action)

const selectedField = ref()

const selectedActionEvent = ref()

const eventArgs = computed(() => {
  // eslint-disable-next-line no-underscore-dangle
  const component = componentsByType[selectedField.value?._type]
  if (component) {
    return argNames(selectedField.value, selectedActionEvent.value)
  }
  return []
})

const title = computed(() => (
  `${selectedActionEvent.value} (${eventArgs.value.map((s) => `$${s}`).join(', ')})`
))

const actionColor = (action: TFrontAction) => stringValue(action?.color, action)

const actionIconColor = (action: TFrontAction) => stringValue(action?.iconColor, action) || 'grey-9'

const actionDescription = (action: TAction) => stringValue(action?.description, action)

const actionIcon = (action: TFrontAction) => stringValue(action?.icon, action)

const actionLabel = (action: TFrontAction) => stringValue(action?.label, action)

const close = () => {
  editor.setActionEvent(undefined)
  editor.setActionId(undefined)
}

onMounted(() => {
  selectedField.value = editor.formFieldInstance(editor.selected)
  selectedActionEvent.value = editor.actionEvent
  editor.unselectAll()
})

onBeforeUnmount(() => {
  editor.unselectAll()
  editor.unselectActionElement()
  editor.select(selectedField.value?._id)
})

</script>

<style scoped lang="sass">
.action-button
  width: 90%
  height: 30px

.title
  background: repeating-linear-gradient(-55deg, rgba(255, 221, 93, .25), rgba(255, 255, 95, .25) 10px, #D5D3C5 10px, #D5D3C5 20px)

.drawer
  overflow: auto
  width: 200px
  height: calc(100vh - 118px)

.container
  overflow: auto
  width: 100%
  height: calc(100vh - 118px)
</style>

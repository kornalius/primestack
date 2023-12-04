<template>
  <div>
    <div
      :class="{
        'action-element': true,
        selected,
        hovered: editor.isHovered(actionElement._id),
      }"
      :style="`padding: 4px 4px 4px ${actionColor ? '24px' : '4px'}`"
      @mouseover.stop="editor.hover(actionElement._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(actionElement._id)"
      @blur="editor.unhover()"
      @click.stop="editor.select(actionElement._id)"
    >
      <div
        class="banner"
        :class="`bg-${actionColor}`"
      />

      <q-btn
        v-if="!editor.isDragging && editor.isHovered(actionElement._id)"
        class="action-button"
        style="right: 0;"
        icon="mdi-trash-can"
        color="red-4"
        size="xs"
        round
        @click.stop="onRemoveClick"
      >
        <q-tooltip :delay="500">
          Remove
        </q-tooltip>
      </q-btn>

      <div class="cursor-pointer">
        <q-tooltip :delay="500">
          {{ $t(actionDescription) }}
        </q-tooltip>

        <div class="row">
          <div class="col-auto q-mr-sm text-grey-9">
            <q-icon
              :name="actionIcon"
              :color="actionIconColor"
              size="sm"
            />
          </div>

          <div class="col">
            <div
              v-if="!actionHideTitle"
              class="row"
            >
              <div class="col text-bold">
                {{ actionLabel }}
              </div>
            </div>

            <div class="row">
              <div class="col">
                <component
                  :is="component"
                  v-if="component"
                  v-model="actionElement"
                  v-bind="binds"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <q-icon
        v-if="action.result && actionAfter(editor.actionInstance(editor.actionId)?._actions, actionElement)"
        class="result-icon shadow-4"
        style="background: white; border-radius: 50%;"
        name="mdi-arrow-down-bold-circle"
        color="green-7"
        size="sm"
      />
    </div>

    <div
      v-if="action.acceptsChildren"
      class="q-ml-xl"
    >
      <actions-list-editor
        v-model="actionElement._children"
        :empty-message="$t(actionChildrenMessage)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useI18n } from 'vue-i18n'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/Editor/store'
import { useActions } from '@/features/Actions/composites'
import { actionElementSchema } from '@/shared/schemas/actions'
import { booleanValue, stringValue } from '@/composites/utilities'
import ActionsListEditor from '@/features/Actions/components/Editor/ActionsListEditor.vue'

type ActionElement = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: ActionElement
  selected?: boolean
}>()

const emit = defineEmits<{
  (e: 'click', value: string): void,
  (e: 'remove', value: ActionElement): void,
  (e: 'update:model-value', value: ActionElement): void,
}>()

const {
  componentForAction,
  actionBinds,
  actionsByType,
  actionAfter,
} = useActions()

const { t } = useI18n()

const actionElement = useModelValue(props, emit)

// eslint-disable-next-line no-underscore-dangle
const action = computed(() => actionsByType[actionElement.value._type])

const component = computed(() => componentForAction(actionElement.value))

const binds = computed(() => actionBinds(actionElement.value))

const editor = useAppEditor()

const onRemoveClick = () => {
  emit('remove', props.modelValue)
}

/**
 * Computes the (TAction) action's 'hideTitle' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<boolean>}
 */
const actionHideTitle = computed(() => (
  booleanValue(action.value?.hideTitle, actionElement.value) || false
))

/**
 * Computes the (TAction) action's 'color' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionColor = computed(() => (
  stringValue(action.value?.color, actionElement.value)
))

/**
 * Computes the (TAction) action's 'iconColor' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionIconColor = computed(() => (
  stringValue(action.value?.iconColor, actionElement.value) || 'grey-9'
))

/**
 * Computes the (TAction) action's 'description' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionDescription = computed(() => (
  stringValue(action.value?.description, actionElement.value)
))

/**
 * Computes the (TAction) action's 'icon' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionIcon = computed(() => (
  stringValue(action.value?.icon, actionElement.value)
))

/**
 * Computes the (TAction) action's 'actionLabel' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionLabel = computed(() => (
  t(stringValue(action.value?.label, actionElement.value))
))

/**
 * Computes the (TAction) action's 'childrenMessage' by calling it
 * if it's a function
 *
 * @returns {ComputedRef<string>}
 */
const actionChildrenMessage = computed(() => (
  stringValue(action.value?.childrenMessage, actionElement.value)
))
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.action-element
  position: relative
  margin: 8px 0
  width: 100%
  border-radius: 2px
  outline: 1px solid $blue-grey-2

  &.selected
    outline: 2px solid $blue-grey-5 !important

  &.hovered
    background: $blue-grey-1

  & .banner
    position: absolute
    left: 0
    top: 0
    bottom: 0
    width: 16px
    border-radius: 2px 0 0 2px

.action-button
  position: absolute
  top: 0
  z-index: 5

.result-icon
  position: absolute
  left: 50%
  bottom: 0
  z-index: 1000
  transform: translate(-50%, 65%)
  opacity: .65
</style>

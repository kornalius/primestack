<template>
  <div>
    <div
      :class="{
        'action-element': true,
        selected,
        hovered: editor.isHovered(actionElement._id),
      }"
      @mouseover.stop="editor.hover(actionElement._id)"
      @mouseleave="editor.unhover()"
      @focus.stop="editor.hover(actionElement._id)"
      @blur="editor.unhover()"
      @click.stop="editor.selectActionElement(actionElement._id)"
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

      <div class="cursor-pointer text-grey-9">
        <q-tooltip :delay="500">
          {{ actionDescription }}
        </q-tooltip>

        <div class="row">
          <div class="col-auto q-mr-sm">
            <q-icon
              :name="actionIcon"
              :color="actionIconColor"
              size="sm"
            />
          </div>

          <div class="col">
            <div class="row">
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
    </div>

    <div
      v-if="action.acceptsChildren"
      class="q-ml-lg"
    >
      <actions-list-editor
        v-model="actionElement._children"
        :actions="actions"
        :empty-message="action.childrenMessage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import { TFrontAction } from '@/features/Actions/interface'
import { actionElementSchema } from '@/shared/schemas/actions'
import useActions from '@/features/Actions/composites'
import ActionsListEditor from '@/features/Actions/components/Editor/ActionsListEditor.vue'

type Action = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: Action
  actions: TFrontAction[]
  selected?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'click', value: string): void,
  (e: 'remove', value: Action): void,
  (e: 'update:model-value', value: Action): void,
}>()

const { componentForAction, actionBinds, actionsByType } = useActions()

const actionElement = useModelValue(props, emit)

// eslint-disable-next-line no-underscore-dangle
const action = computed(() => actionsByType[actionElement.value._type])

const component = computed(() => componentForAction(actionElement.value))

const binds = computed(() => actionBinds(actionElement.value))

const editor = useAppEditor()

const onRemoveClick = () => {
  emit('remove', props.modelValue)
}

const actionColor = computed(() => {
  if (typeof action.value.color === 'function') {
    return action.value.color(actionElement.value)
  }
  return action.value.color
})

const actionIconColor = computed(() => {
  if (typeof action.value.iconColor === 'function') {
    return action.value.iconColor(actionElement.value)
  }
  return action.value.iconColor || 'grey-8'
})

const actionDescription = computed(() => {
  if (typeof action.value.description === 'function') {
    return action.value.description(actionElement.value)
  }
  return action.value.description
})

const actionIcon = computed(() => {
  if (typeof action.value.icon === 'function') {
    return action.value.icon(actionElement.value)
  }
  return action.value.icon
})

const actionLabel = computed(() => {
  if (typeof action.value.label === 'function') {
    return action.value.label(actionElement.value)
  }
  return action.value.label
})
</script>

<style scoped lang="sass">
.action-element
  position: relative
  margin: 8px 0
  padding: 4px 4px 4px 24px
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
</style>
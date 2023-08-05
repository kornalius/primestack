<template>
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
      :class="`bg-${action.color}`"
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
        {{ action.description }}
      </q-tooltip>

      <div class="row items-center">
        <div class="col-auto q-mr-sm">
          <q-icon
            :name="action.icon"
            size="sm"
          />
        </div>

        <div class="col text-bold">
          {{ action.label }}
        </div>
      </div>

      <div class="row q-gutter-sm" style="margin-left: 24px;">
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

    <div v-if="action.acceptsChildren && actionElement._children.length">
      <actions-list-editor
        v-model="actionElement._children"
        :actions="actions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { useModelValue } from '@/composites/prop'
import useAppEditor from '@/features/App/store'
import { TAction } from '@/shared/interfaces/actions'
import { actionElementSchema } from '@/shared/schemas/actions'
import useActions from '@/features/Actions/composites'
import ActionsListEditor from '@/features/Actions/components/Editor/ActionsListEditor.vue'

type Action = Static<typeof actionElementSchema>

const props = defineProps<{
  modelValue: Action
  actions: TAction[]
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
</script>

<style scoped lang="sass">
.action-element
  position: relative
  margin: 8px 0
  padding: 4px 4px 4px 24px
  width: 100%
  border-radius: 4px
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
    width: 20px
    border-radius: 4px 0 0 4px

.action-button
  position: absolute
  top: 0
  z-index: 5
</style>

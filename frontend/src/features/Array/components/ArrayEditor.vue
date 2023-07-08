<template>
  <div>
    <div
      v-if="addButton === 'top' || addButton === undefined"
      class="column items-end q-my-sm"
    >
      <div class="col">
        <slot name="actions" />

        <q-btn
          v-if="clearable"
          class="q-mr-sm"
          :label="clearLabel"
          :round="!clearLabel"
          :disable="clearDisabled"
          :icon="clearIcon || 'mdi-notification-clear-all'"
          color="negative"
          size="x-small"
          flat
          @click="clear"
        />

        <q-btn
          :label="addLabel"
          :round="!addLabel"
          :disable="addDisabled"
          :icon="addIcon || 'mdi-plus'"
          color="primary"
          size="x-small"
          flat
          @click="addItem"
        />
      </div>
    </div>

    <div :style="{ height: height ? `${height}px` : '', overflowY: 'auto' }">
      <draggable
        v-model="values"
        :item-key="itemKeyFor"
        :sort="reorderable"
        :group="{
          name: 'array-editor',
          pull: false,
          put: true,
        }"
        handle=".drag-handle"
        :animation="150"
        easing="cubic-bezier(1, 0, 0, 1)"
        @change="onChange"
      >
        <template #item="{ value, index }">
          <div
            class="row items-center"
            style="min-height: 30px;"
            @mouseover="hover = index as number"
            @mouseleave="hover = -1"
            @focus="hover = index as number"
            @blur="hover = -1"
          >
            <div
              v-if="reorderable"
              class="col-auto q-mr-sm"
              style="cursor: move; padding-bottom: 4px;"
            >
              <q-icon class="drag-handle" name="mdi-drag" size="large" />
            </div>

            <div class="col">
              <slot
                v-bind="{
                  value: values[index],
                  index,
                  hover: hover === index,
                  disabled: (itemDisabled && itemDisabled(index as number)) || disabled,
                }"
              >
                <div>{{ value }}</div>
              </slot>
            </div>

            <div class="col-auto q-ml-sm" style="width: 30px;">
              <q-btn
                v-show="hover === index"
                :disable="disabled"
                :icon="removeIcon || 'mdi-trash-can-outline'"
                color="negative"
                size="x-small"
                round
                flat
                @click="removeItem(values[index])"
              />
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <div
      v-if="addButton === 'bottom'"
      class="column items-end q-my-sm"
    >
      <div class="col">
        <slot name="actions" />

        <q-btn
          v-if="clearable"
          class="q-mr-sm"
          :label="clearLabel"
          :round="!clearLabel"
          :disable="clearDisabled"
          :icon="clearIcon || 'mdi-notification-clear-all'"
          color="negative"
          size="x-small"
          flat
          @click="clear"
        />

        <q-btn
          :label="addLabel"
          :round="!addLabel"
          :disable="addDisabled"
          :icon="addIcon || 'mdi-plus'"
          color="primary"
          size="x-small"
          flat
          @click="addItem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useModelValue } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'

const props = defineProps<{
  modelValue: unknown[]
  // synched value for validifity of the array
  valid?: boolean
  // disabled the clear button
  addDisabled?: boolean
  // icon for the add button
  addIcon?: string
  // label for the add button
  addLabel?: string
  // position of the add button
  addButton?: 'top' | 'bottom'
  // function to execute to add a new item to the array, return the value if successful
  addFunction: () => unknown | undefined
  // function to execute to remove an item from the array, return the true is successful
  removeFunction: (index: number, value: unknown) => boolean
  // height in pixels of the component
  height?: number
  // disable all interactions
  disabled?: boolean
  // add a button to clear all items
  clearable?: boolean
  // disabled the clear button
  clearDisabled?: boolean
  // icon for the clear button
  clearIcon?: string
  // label for the clear button
  clearLabel?: string
  // function that returns if the item at index is disabled or not
  itemDisabled?: (index: number) => boolean
  // icon for the remove button
  removeIcon?: string
  // function called before removing item at index
  canRemove?: (index: number) => boolean
  // minimum number of items the array must contain to be valid
  min?: number
  // maximum number of items the array must contain to be valid
  max?: number
  // can the items be re-ordered?
  reorderable?: boolean
  // can we reorder a specific item in the array?
  canReorder?: (index: number) => boolean
  // field or function to identify an item key
  itemKey?: string | ((value: unknown) => string)
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', index: number, value: unknown): void,
  (e: 'clear'): void,
  (e: 'moved', oldIndex: number, newIndex: number): void,
  (e: 'update:valid', isValid: boolean): void,
  (e: 'update:model-value', value: unknown[]): void,
}>()

/**
 * Draggable
 */

const values = useModelValue(props, emit)

const onChange = (evt: AnyData) => {
  if (evt.moved) {
    emit('moved', evt.moved.oldIndex, evt.moved.newIndex)
  }
  // eslint-disable-next-line no-console
  console.log(evt)
}

const itemKeyFor = (item: unknown): string => (
  props.itemKey ? (props.itemKey as (item: unknown) => void)(item) : values.value.indexOf(item)
)

const hover = ref(-1)

/**
 * Mutation methods
 */

const addItem = () => {
  const newValue = props.addFunction()
  if (newValue) {
    emit('add', newValue)
  }
}

const removeItem = (value: unknown) => {
  const idx = values.value.indexOf(value)
  if (
    idx !== -1
    && (!props.canRemove || props.canRemove(idx))
    && props.removeFunction(idx, value)
  ) {
    emit('remove', idx, value)
  }
}

const clear = () => {
  emit('clear')
}

/**
 * Array validity
 */

const isValid = computed(() => (
  (props.min === 0 || values.value.length >= props.min)
  && (props.max === 0 || values.value.length <= props.max)
))

watch(isValid, () => {
  emit('update:valid', isValid.value)
}, { immediate: true })
</script>

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
        <template #item="{ element: value, index }">
          <div
            class="row items-center line"
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

            <div
              v-if="selectable && isItemSelectable(value)"
              class="col-auto"
            >
              <q-checkbox
                v-model="currentSelection"
                :val="itemKeyFor(value)"
              />
            </div>

            <div class="col">
              <slot
                :value="values[index]"
                :index="index"
                :hover="hover === index"
                :disabled="(itemDisabled && itemDisabled(index as number)) || disabled"
              >
                <div>{{ display(value) }}</div>
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
import { useModelValue, useSyncedProp } from '@/composites/prop'
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
  removeFunction: (value: unknown, index: number) => boolean
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
  canRemove?: (value: unknown) => boolean
  // minimum number of items the array must contain to be valid
  min?: number
  // maximum number of items the array must contain to be valid
  max?: number
  // can the items be re-ordered?
  reorderable?: boolean
  // can we reorder a specific item in the array?
  canReorder?: (value: unknown) => boolean
  // field or function to identify an item key
  itemKey?: string | ((value: unknown) => string)
  // make each item in the list selectable
  selectable?: boolean
  // can we select this specific item in the array?
  canSelect?: (value: unknown) => boolean
  // selections
  selection?: unknown[]
  // key to display in the list or a function that returns a string
  displayValue?: ((value: unknown) => string) | string
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'remove', value: unknown, index: number): void,
  (e: 'clear'): void,
  (e: 'moved', oldIndex: number, newIndex: number): void,
  (e: 'select', value: unknown, selected: boolean): void,
  (e: 'update:valid', isValid: boolean): void,
  (e: 'update:selection', value: unknown[]): void,
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
}

const itemKeyFor = (item: unknown): string => (
  props.itemKey
    ? (props.itemKey as (item: unknown) => void)(item)
    : values.value.indexOf(item)
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
    && (!props.canRemove || props.canRemove(value))
    && props.removeFunction(value, idx)
  ) {
    emit('remove', value, idx)
  }
}

const clear = () => {
  emit('clear')
}

const display = (value: unknown): string => {
  if (typeof props.displayValue === 'string') {
    return value[props.displayValue] as string
  }
  if (typeof props.displayValue === 'function') {
    return props.displayValue(value)
  }
  return value as string
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

/**
 * Selection
 */

const currentSelection = useSyncedProp(props, 'selection', emit)

const isItemSelectable = (value: unknown): boolean => (
  !props.canSelect || props.canSelect(value)
)

watch(currentSelection, (newValue, oldValue) => {
  newValue.forEach((v) => {
    if (!oldValue.includes(v)) {
      emit('select', v, true)
    }
  })

  oldValue.forEach((v) => {
    if (!newValue.includes(v)) {
      emit('select', v, false)
    }
  })
})
</script>

<style scoped lang="sass">
.line:not(:last-child)
  margin-bottom: 4px
  border-bottom: 1px solid lightgrey
</style>

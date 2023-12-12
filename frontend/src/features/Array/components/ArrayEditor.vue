<template>
  <div :class="mainClass">
    <!-- Start action buttons -->

    <div
      v-if="['start', undefined].includes(addButton)"
      :class="actionsClass"
    >
      <div class="col">
        <slot name="actions" />

        <!-- Clear button -->

        <q-btn
          v-if="clearable"
          class="q-mr-sm"
          :label="clearLabel"
          :round="!clearLabel"
          :disable="disable || clearDisable"
          :icon="clearIcon || 'mdi-notification-clear-all'"
          color="negative"
          size="sm"
          flat
          @click="clear"
        >
          <q-tooltip :delay="500">
            {{ clearLabel || $t('buttons.clear') }}
          </q-tooltip>
        </q-btn>

        <!-- Add button -->

        <add-button
          :label="addLabel"
          :disable="disable || addDisable"
          :options="addOptions"
          @click="addItem"
          @click-option="(value) => $emit('add-option', value)"
        />
      </div>
    </div>

    <!-- Draggable area -->

    <div
      :class="{ 'inline-block': horizontal }"
      :style="{
        width: width ? `${width}px` : '',
        height: height ? `${height}px` : '',
        overflowX: horizontal ? 'auto' : '',
        overflowY: !horizontal ? 'auto' : '',
      }"
    >
      <draggable
        v-model="values"
        :item-key="itemKeyFor"
        :sort="reorderable"
        :group="{ name: hexObjectId() }"
        handle=".drag-handle"
        :animation="150"
        easing="cubic-bezier(1, 0, 0, 1)"
        @change="onChange"
      >
        <template #item="{ element: value, index }">
          <div
            class="items-center"
            :class="{
              item: true,
              row: !horizontal,
              'inline-block': horizontal,
              vline: !horizontal && !noSeparator,
              hline: horizontal && !noSeparator,
              'q-mx-xs': true,
            }"
            style="min-height: 30px;"
            @mouseover="hover = index as number"
            @mouseleave="hover = -1"
            @focus="hover = index as number"
            @blur="hover = -1"
          >
            <!-- Drag handle -->

            <div
              v-if="reorderable"
              :class="{ 'col-auto': !horizontal, 'inline-block': horizontal }"
              style="cursor: move; padding-bottom: 4px;"
            >
              <q-icon class="drag-handle" name="mdi-drag" size="large" />
            </div>

            <!-- Selection checkbox -->

            <div
              v-if="selectable && isItemSelectable(value)"
              :class="{ 'col-auto': !horizontal, 'inline-block': horizontal }"
            >
              <q-checkbox
                v-model="currentSelection"
                :val="itemKeyFor(value)"
              />
            </div>

            <!-- Item -->

            <div
              :class="{ col: !horizontal, 'inline-block': horizontal }"
            >
              <slot
                :value="values[index]"
                :index="index"
                :hover="hover === index"
                :disable="(itemDisable && itemDisable(index as number)) || disable"
              >
                <div>{{ display(value) }}</div>
              </slot>
            </div>

            <!-- Remove button -->

            <div
              :class="{ 'col-auto': !horizontal, 'inline-block': horizontal }"
              style="width: 30px;"
            >
              <q-btn
                v-if="!canRemove || canRemove(values[index])"
                v-show="hover === index"
                :disable="disable || removeDisable"
                :icon="removeIcon || 'mdi-trash-can-outline'"
                color="red-6"
                size="sm"
                round
                flat
                @click="removeItem(values[index])"
              >
                <q-tooltip :delay="500">
                  {{ removeLabel || $t('buttons.remove') }}
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- End actions -->

    <div
      v-if="addButton === 'end'"
      :class="{
        column: !horizontal,
        'items-end': !horizontal,
        'q-ma-sm': !horizontal,
        'inline-block': horizontal,
        'full-height': horizontal,
      }"
    >
      <div :class="{ col: !horizontal, 'inline-block': horizontal }">
        <slot name="actions" />

        <!-- Clear button -->

        <q-btn
          v-if="clearable"
          class="q-mr-sm"
          :label="clearLabel"
          :round="!clearLabel"
          :disable="disable || clearDisable"
          :icon="clearIcon || 'mdi-notification-clear-all'"
          color="negative"
          size="sm"
          flat
          @click="clear"
        >
          <q-tooltip :delay="500">
            {{ clearLabel || $t('buttons.clear') }}
          </q-tooltip>
        </q-btn>

        <!-- Add button -->

        <add-button
          :label="addLabel"
          :disable="disable || addDisable"
          :options="addOptions"
          @click="addItem"
          @click-option="(value) => $emit('add-option', value)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, watch,
} from 'vue'
import hexObjectId from 'hex-object-id'
import draggable from 'vuedraggable'
import { useModelValue, useSyncedProp } from '@/composites/prop'
import { AnyData } from '@/shared/interfaces/commons'
import { AddOption } from '@/features/Fields/interfaces'
import AddButton from '@/features/Fields/components/AddButton.vue'

const props = defineProps<{
  // Array to be edited
  modelValue: unknown[] | undefined
  // synched value for validifity of the array
  valid?: boolean
  // disable the clear button
  addDisable?: boolean
  // disable the remove button
  removeDisable?: boolean
  // icon for the add button
  addIcon?: string
  // label for the add button
  addLabel?: string
  // add button's menu options
  addOptions?: AddOption[]
  // position of the add button
  addButton?: 'start' | 'end'
  // function to execute to add a new item to the array, return the value if successful
  addFunction: () => unknown | undefined
  // function to execute to remove an item from the array
  removeFunction: (value: unknown, index: number) => void
  // width in pixels of the component
  width?: number
  // height in pixels of the component
  height?: number
  // disable all interactions
  disable?: boolean
  // add a button to clear all items
  clearable?: boolean
  // disable the clear button
  clearDisable?: boolean
  // icon for the clear button
  clearIcon?: string
  // label for the clear button
  clearLabel?: string
  // function that returns if the item at index is disabled or not
  itemDisable?: (index: number) => boolean
  // icon for the remove button
  removeIcon?: string
  // label for the remove button
  removeLabel?: string
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
  // remove the separator lines between the items
  noSeparator?: boolean
  // align items horizontally
  horizontal?: boolean
}>()

const emit = defineEmits<{
  (e: 'add', value: unknown): void,
  (e: 'add-option', value: string): void,
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

/**
 * Occurs when items order is changed
 *
 * @param evt
 */
const onChange = (evt: AnyData) => {
  const { moved } = evt as { moved: AnyData }
  if (moved) {
    emit('moved', moved.oldIndex, moved.newIndex)
  }
}

/**
 * Returns a computed item key
 *
 * @param item Item to get the item key from
 *
 * @returns {string} Key for the item
 */
const itemKeyFor = (item: unknown): string => (
  props.itemKey
    ? (props.itemKey as (item: unknown) => void)(item)
    : values.value.indexOf(item)
)

const hover = ref(-1)

/**
 * Mutation methods
 */

/**
 * Add an item to the array
 *
 * @returns {unknown} Newly added item
 */
const addItem = (): unknown => {
  const newValue = props.addFunction()
  if (newValue) {
    emit('add', newValue)
  }
  return newValue
}

/**
 * Removes an item from the array
 *
 * @param value Item to be removed
 *
 * @returns {boolean} True when successful
 */
const removeItem = (value: unknown): boolean => {
  const idx = values.value.indexOf(value)
  if (idx !== -1 && (!props.canRemove || props.canRemove(value))) {
    if (props.removeFunction) {
      props.removeFunction(value, idx)
    }
    emit('remove', value, idx)
    return true
  }
  return false
}

/**
 * Emits a clear event
 */
const clear = () => {
  emit('clear')
}

/**
 * Returns a display string for the item
 *
 * @param value Item to generate a display string from
 *
 * @returns {string} Display string for the item
 */
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

/**
 * Computes if the array is valid by checking for minimum and maximum length
 */
const isValid = computed((): boolean => (
  (props.min === 0 || values.value.length >= props.min)
  && (props.max === 0 || values.value.length <= props.max)
))

/**
 * When isValid changes, update its attached prop
 */
watch(isValid, () => {
  emit('update:valid', isValid.value)
}, { immediate: true })

/**
 * Selection
 */

const currentSelection = useSyncedProp(props, 'selection', emit)

/**
 * Checks if an item is selectable
 *
 * @param value Item to check upon
 *
 * @returns {boolean} True if selectable
 */
const isItemSelectable = (value: unknown): boolean => (
  !props.canSelect || props.canSelect(value)
)

/**
 * When the selection changes
 */
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

const mainClass = computed(() => ({
  row: props.horizontal,
  'items-center': props.horizontal,
}))

const actionsClass = computed(() => ({
  column: !props.horizontal,
  'items-end': !props.horizontal,
  'q-my-sm': !props.horizontal,
  'inline-block': props.horizontal,
}))

onMounted(() => {
  if (!values.value) {
    values.value = []
  }
})
</script>

<style scoped lang="sass">
.vline:not(:last-child)
  margin-bottom: 4px
  padding-bottom: 4px
  border-bottom: 1px solid lightgrey

.hline:not(:last-child)
  margin-right: 4px
  padding-right: 4px
  border-right: 1px solid lightgrey
</style>

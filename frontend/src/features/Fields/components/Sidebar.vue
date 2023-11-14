<template>
  <div
    v-if="opened"
    v-bind="$attrs"
    :class="{
      bar: true,
      bordered,
      right,
    }"
    @mouseover.stop="hover = true"
    @mouseleave="hover = false"
    @focus.stop="hover = true"
    @blur="hover = false"
  >
    <q-btn
      v-if="hover && closeable"
      :class="{
        'close-button': true,
        right,
      }"
      style="opacity: .85"
      :icon="closeIcon || (right ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left')"
      color="white"
      text-color="blue-9"
      size="sm"
      dense
      round
      @click="opened = false"
    >
      <q-tooltip :delay="500">
        {{ closeTooltip || $t('sidebar.close') }}
      </q-tooltip>
    </q-btn>

    <slot />
  </div>

  <div v-else>
    <q-btn
      :icon="hoverMenu
        ? (openIcon || (right ? 'mdi-chevron-double-left' : 'mdi-chevron-double-right'))
        : (menuIcon || 'mdi-menu')
      "
      :text-color="hoverMenu ? 'blue-9' : undefined"
      size="sm"
      dense
      flat
      round
      @mouseover.stop="hoverMenu = true"
      @mouseleave="hoverMenu = false"
      @focus.stop="hoverMenu = true"
      @blur="hoverMenu = false"
      @click="opened = true"
    >
      <q-tooltip :delay="500">
        {{ openTooltip || $t('sidebar.open') }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: boolean
  closeable?: boolean
  closeIcon?: string
  menuIcon?: string
  openIcon?: string
  openTooltip?: string
  closeTooltip?: string
  right?: boolean
  bordered?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void,
}>()

const opened = useModelValue(props, emit)

const hover = ref(false)

const hoverMenu = ref(false)
</script>

<style scoped lang="sass">
@import 'quasar/src/css/variables'

.bar
  position: relative

.close-button
  position: absolute
  top: 0
  right: 0
  width: 24px
  height: 24px
  transform: translate(25%, -25%)
  z-index: 5

  &.right
    left: 0
    right: unset
    transform: translate(-25%, -25%)

.bordered
  border-right: 1px solid $grey-4 !important

.bordered.right
  border-right: unset !important
  border-left: 1px solid $grey-4 !important
  margin-left: 4px !important
</style>

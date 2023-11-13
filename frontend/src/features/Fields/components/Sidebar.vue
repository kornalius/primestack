<template>
  <div
    v-if="opened"
    class="bar relative-position"
    @mouseover.stop="hover = true"
    @mouseleave="hover = false"
    @focus.stop="hover = true"
    @blur="hover = false"
  >
    <q-btn
      v-if="hover && closeable"
      class="close-button"
      style="opacity: .85"
      :icon="closeIcon || 'mdi-chevron-double-left'"
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
      :icon="hoverMenu ? (openIcon || 'mdi-chevron-double-right') : (menuIcon || 'mdi-menu')"
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
import { onMounted, ref, watch } from 'vue'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: boolean
  storageKey?: string
  closeable?: boolean
  closeIcon?: string
  menuIcon?: string
  openIcon?: string
  openTooltip?: string
  closeTooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string): void,
}>()

const opened = useModelValue(props, emit)

const hover = ref(false)

const hoverMenu = ref(false)

watch(opened, () => {
  const v = opened.value ? 'true' : 'false'
  if (props.storageKey && localStorage.getItem(props.storageKey) !== v) {
    localStorage.setItem(props.storageKey, v)
  }
})

onMounted(() => {
  if (props.storageKey) {
    opened.value = localStorage.getItem(props.storageKey) === 'true'
  }
})
</script>

<style scoped lang="sass">
.close-button
  position: absolute
  top: 0
  right: 0
  width: 24px
  height: 24px
  transform: translate(25%, -25%)
  z-index: 5
</style>

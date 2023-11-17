<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :class="{ 'color-input': true, cssColor: !quasarPalette, isTextWhite }"
    :bg-color="quasarPalette ? value : undefined"
    :style="{ background: !quasarPalette ? value : undefined }"
    clearable
  >
    <template #append>
      <q-icon
        class="cursor-pointer"
        name="mdi-eyedropper-variant"
        :style="{ color: isTextWhite ? 'white' : 'black' }"
      >
        <q-popup-proxy
          transition-show="scale"
          transition-hide="scale"
          cover
        >
          <q-color
            v-model="value"
            default-view="palette"
            :palette="palette"
            no-header
            v-close-popup
          />
        </q-popup-proxy>
      </q-icon>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <q-tooltip v-if="tooltip" :delay="500">
      {{ tooltip }}
    </q-tooltip>
  </q-input>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { colors } from 'quasar'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | null | undefined
  quasarPalette?: boolean
  tooltip?: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const value = useModelValue(props, emit)

const { hexToRgb, textToRgb } = colors

const quasar = computed(() => (
  Array.from(document.querySelectorAll('head style'))
    .filter((s) => s.dataset.viteDevId?.endsWith('quasar/src/css/index.sass'))
))

const quasarColors = computed(() => (
  Array.from(quasar.value?.[0].sheet.cssRules)
    .filter((r: CSSStyleRule) => r.selectorText?.startsWith('.text-'))
    .map((r: CSSStyleRule) => ({
      name: r.selectorText.replace('.text-', ''),
      color: r.style.color,
    }))
    .sort()
))

const palette = computed(() => (
  quasarColors.value.map((c) => c.color)
))

watch(value, () => {
  if (value.value?.startsWith('rgb(')) {
    const rgb = textToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      emit(
        'update:model-value',
        props.quasarPalette ? color.name : color.color,
      )
    }
  } else if (value.value?.startsWith('#')) {
    const rgb = hexToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      emit(
        'update:model-value',
        props.quasarPalette ? color.name : color.color,
      )
    }
  } else {
    const color = quasarColors.value.find((c) => c.name === value.value)
    if (color) {
      emit(
        'update:model-value',
        props.quasarPalette ? color.name : color.color,
      )
    }
  }
})

const rgbStringToHexString = (rgb: string): string => (
  rgb
    .split('(')?.[1]
    .split(')')?.[0]
    .split(',')
    .map((x) => {
      const nx = parseInt(x, 10).toString(16)
      return (nx.length === 1) ? `0${nx}` : nx
    })
    .join('')
)

const isTextWhite = computed(() => {
  let hex: string = value.value

  if (value.value?.startsWith('rgb(')) {
    const rgb = textToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      hex = rgbStringToHexString(color.color)
    }
  } else if (value.value?.startsWith('#')) {
    const rgb = hexToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      hex = rgbStringToHexString(color.color)
    }
  } else {
    const color = quasarColors.value.find((c) => c.name === value.value)
    if (color) {
      hex = rgbStringToHexString(color.color)
    }
  }

  if (hex) {
    const r = parseInt(hex.substring(0, 2), 16) // hexToR
    const g = parseInt(hex.substring(2, 4), 16) // hexToG
    const b = parseInt(hex.substring(4, 6), 16) // hexToB
    return (r * 0.299) + (g * 0.587) + (b * 0.114) < 165
  }

  return false
})
</script>

<style lang="sass">
.color-input.cssColor .q-field__control
  background-color: unset

.color-input.isTextWhite .q-field__native,
.color-input.isTextWhite .q-field__label
  color: white
</style>

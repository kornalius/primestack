<template>
  <q-input
    v-model="value"
    v-bind="$attrs"
    :bg-color="value"
    :input-style="{
      color: 'rgb(255, 255, 255)',
      mixBlendMode: 'difference',
    }"
  >
    <template #append>
      <q-icon
        class="cursor-pointer"
        name="mdi-eyedropper-variant"
        :style="{
          color: 'rgb(255, 255, 255)',
          mixBlendMode: 'difference',
        }"
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
  </q-input>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { colors } from 'quasar'
import { useModelValue } from '@/composites/prop'

const props = defineProps<{
  modelValue: string | null | undefined
  quasarPalette?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
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
  props.quasarPalette
    ? quasarColors.value.map((c) => c.color)
    : undefined
))

watch(value, () => {
  if (value.value?.startsWith('rgb(')) {
    const rgb = textToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      emit('update:model-value', color.name)
    }
  } else if (value.value?.startsWith('#')) {
    const rgb = hexToRgb(value.value)
    const rgbText = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
    const color = quasarColors.value.find((c) => c.color === rgbText)
    if (color) {
      emit('update:model-value', color.name)
    }
  }
})
</script>

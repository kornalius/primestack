<template>
  <div
    v-if="!pre"
    :class="cls"
    style="min-height: 1.5em;"
  >
    {{ modelValue }}
  </div>

  <pre
    v-else
    class="q-my-none"
    :class="cls"
  >
    {{ modelValue }}
  </pre>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Formatting = 'overline' | 'title' | 'subtitle' | 'caption'

type Styling = 'bold' | 'italic' | 'underline' | 'strike'

type Casing = 'uppercase' | 'lowercase' | 'capitalize'

type Heading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const props = defineProps<{
  modelValue: string | null | undefined
  format?: Formatting
  styling?: Record<Styling, Styling>
  casing?: Casing
  heading?: Heading
  pre?: boolean
}>()

const cls = computed(() => {
  const styling = Object.keys(props.styling || {})
    .filter((k) => props.styling[k])
    .map((k) => `text-${k}`)
  return `text-${props.format} ${styling.join(' ')} text-${props.casing} text-${props.heading}`
})
</script>

<template>
  <div :class="cls" style="min-height: 1.5em;">
    {{ modelValue }}
  </div>
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
  styling?: Styling
  casing?: Casing
  heading?: Heading
}>()

const cls = computed(() => (
  `text-${props.format} text-${props.styling} text-${props.casing} text-${props.heading}`
))
</script>

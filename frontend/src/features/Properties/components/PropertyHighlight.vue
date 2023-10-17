<template>
  <span
    v-if="disabledLabel"
    class="no-wrap"
    :class="{ 'text-negative': disabled }"
  >
    {{ disabledLabel }}
  </span>

  <div v-else>
    <q-tooltip class="bg-grey-4" :delay="500">
      <code
        class="hljs"
        v-html="hljs.highlight(modelValue || '', { language }).value"
      />
    </q-tooltip>

    <pre class="flex">
      <code
        class="hljs"
        style="max-height: 250px; width: 180px;"
        v-html="hljs.highlight(modelValue || '', { language }).value"
      />
    </pre>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import hljs from 'highlight.js'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import basic from 'highlight.js/lib/languages/basic'

const props = defineProps<{
  modelValue: string | undefined
  language: string
  disabled?: boolean
  disabledLabel?: string
}>()

/**
 * When language prop changes, register the correct language into hljs
 */
watch(() => props.language, () => {
  if (props.language === 'javascript') {
    hljs.registerLanguage('javascript', javascript)
  }

  if (props.language === 'json') {
    hljs.registerLanguage('json', json)
  }

  if (props.language === 'basic') {
    hljs.registerLanguage('basic', basic)
  }
}, { immediate: true })
</script>

<template>
  <q-item
    v-for="menu in modelValue"
    :key="menu.name"
    clickable
    v-ripple
    @click="$emit('insert', menu.value, menu.cursorAdj || 0)"
  >
    <q-item-section avatar>
      <q-icon
        v-if="menu.icon"
        :name="menu.icon"
        color="grey-9"
        size="xs"
      />
    </q-item-section>

    <q-item-section>
      {{ menu.label }}
    </q-item-section>

    <q-item-section
      v-if="menu.children?.length > 0"
      side
    >
      <q-icon name="mdi-menu-right" size="xs" />
    </q-item-section>

    <q-menu
      v-if="menu.children?.length > 0"
      anchor="top start"
      self="top end"
      fit
    >
      <q-list dense>
        <code-dropdown
          :model-value="menu.children"
          @insert="(value, cursorAdj) => $emit('insert', value, cursorAdj)"
        />
      </q-list>
    </q-menu>

    <q-tooltip
      v-if="menu.tooltip"
      :delay="500"
    >
      <code
        class="hljs text-white"
        v-html="html(menu.tooltip)"
      />
    </q-tooltip>
  </q-item>
</template>

<script setup lang="ts">
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { ExpressionMenu } from '../interfaces'

defineProps<{
  modelValue: ExpressionMenu[]
}>()

defineEmits<{
  (e: 'insert', value: string, cursorAdj: number): void,
}>()

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

marked.use({
  breaks: true,
  gfm: true,
})

const style = `
  <style>
    table {
      border-collapse: collapse;
      margin: .5em;
    }
    th {
      background-color: #5781ab;
      color: white;
    }
    th, td {
      border: 1px solid #000;
      padding: 5px;
    }
  </style>
`

const html = (text: string) => (
  marked.parse(`${style}\n${text}`) as string
)
</script>

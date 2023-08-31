<template>
  <codemirror
    v-model="value"
    v-bind="$attrs"
    :tab-size="2"
    :extensions="extensions"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { CompletionContext, autocompletion, Completion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/App/store'
import { useVariables } from '@/features/Variables/store'
import { SyntaxNode } from '@lezer/common'

const props = defineProps<{
  modelValue: string | null | undefined
  langJson?: boolean
  langJs?: boolean
  dark?: boolean
}>()

// eslint-disable-next-line vue/valid-define-emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (e: 'update:model-value', value: string | null | undefined): void,
}>()

const editor = useAppEditor()

const variables = useVariables()

const toOptions = (opts: string[], type = 'keyword'): Completion[] => (
  opts.map((k) => ({ label: k, type }))
)

const fctOptions = toOptions([
  'str',
  'doc',
  'var',
  'field',
  'table',
  'route',
  'param',
], 'method')

const myCompletions = (context: CompletionContext) => {
  const tokensBefore = (count: number): SyntaxNode[] => {
    const tokens = []
    let node = syntaxTree(context.state).resolveInner(context.pos, -1)
    for (let x = count; x > 0; x--) {
      if (node === null) {
        break
      }
      tokens.unshift(node)
      if (node.prevSibling) {
        node = node.prevSibling
      } else {
        node = node.parent
      }
    }
    return tokens
  }

  const check = (args: string[]): boolean => {
    const tokens = tokensBefore(args.length)
    for (let x = 0; x < args.length; x++) {
      const node = tokens[x]
      const n = context.state.doc.slice(node.from, node.to).toString()
      if (node.name !== args[x] && n !== args[x]) {
        return false
      }
    }
    return true
  }

  const word = context.matchBefore(/\w*/)
  if (word.from === word.to && !context.explicit) {
    return null
  }

  let options = fctOptions

  const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)

  if (check(['str', 'ArgList', '(', 'String'])) {
    options = []
  } else if (check(['doc', 'ArgList', '(', 'String'])) {
    options = []
  } else if (check(['table', 'ArgList', '(', 'String'])
    || check(['field', 'ArgList', '(', 'String'])) {
    options = toOptions(editor.tables.map((t) => t.name))
  } else if (check(['field', 'ArgList', '(', 'String', ',', 'String'])) {
    const tokens = tokensBefore(5)
    const tt = tokens[2]
    const n = context.state.doc.slice(tt.from + 1, tt.to - 1).toString()
    const table = editor.tables.find((t) => t.name === n)
    options = toOptions(table ? table.fields.map((f) => f.name) : [])
  } else if (check(['var', 'ArgList', '(', 'String'])) {
    options = toOptions(variables.variableNames)
  } else if (nodeBefore.name === 'String') {
    options = []
  }

  const textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
  const tagBefore = /\w*$/.exec(textBefore)
  if (!tagBefore && !context.explicit) {
    return null
  }

  return {
    from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
    options,
    validFor: /^(\w*)?$/,
  }
}

const extensions = []

if (props.dark) {
  extensions.push(oneDark)
}

if (props.langJson) {
  extensions.push(json())
}

if (props.langJs) {
  extensions.push(javascript())
  extensions.push(autocompletion({ override: [myCompletions] }))
}

const value = useModelValue(props, emit)

const view = shallowRef()

const handleReady = (payload) => {
  view.value = payload.view
}
</script>

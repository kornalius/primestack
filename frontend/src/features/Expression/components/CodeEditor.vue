<template>
  <div class="row">
    <div class="col-auto mainmenu bg-grey-2">
      <code-menu
        :model-value="expr.mainmenu.value"
        @insert="insertIntoCode"
      />
    </div>

    <div class="col">
      <codemirror
        v-model="value"
        v-bind="$attrs"
        style="width: 100%; height: 100%;"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Static } from '@feathersjs/typebox'
import { Codemirror } from 'vue-codemirror'
import { useI18n } from 'vue-i18n'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { SyntaxNode } from '@lezer/common'
import { CompletionContext, autocompletion, Completion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { actionElementSchema } from '@/shared/schemas/actions'
import { computeActionResults, parentAction } from '@/features/Actions/composites'
import { useModelValue } from '@/composites/prop'
import { useApp } from '@/features/App/store'
import { useAppEditor } from '@/features/App/editor-store'
import { useVariables } from '@/features/Variables/store'
import { useTable } from '@/features/Tables/composites'
import { useExpression } from '@/features/Expression/composites'
import { fcts } from '@/features/Expression/fcts'
import CodeMenu from './CodeMenu.vue'

type ActionElement = Static<typeof actionElementSchema>

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

const app = useApp()

const variables = useVariables()

const { extraFields } = useTable()

const { t } = useI18n()

const expr = useExpression(t)

const ctx = expr.buildCtx()

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

const toOptions = (opts: string[], type = 'keyword'): Completion[] => (
  opts.map((k) => ({
    label: k,
    type,
    info: fcts[k] ? () => {
      const el = document.createElement('div')
      el.innerHTML = marked.parse(`${style}\n${fcts[k]}`) as string
      el.style.overflow = 'auto'
      el.style.maxHeight = '600px'
      el.style.fontSize = '.95em'
      return el
    } : undefined,
  }))
)

const fctOptions = toOptions(Object.keys(fcts), 'method')

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
  } else if (check(['$result', 'ArgList', '(', 'String'])) {
    options = []
    const action = editor.actionElementInstance(editor.selectedActionElement)
    if (action) {
      // eslint-disable-next-line no-underscore-dangle
      const actions = editor.actionInstance(editor.actionId)._actions
      const parent = parentAction(actions, action)
      // eslint-disable-next-line no-underscore-dangle
      const parentActions = parent?._children as ActionElement[] || actions
      options = toOptions(computeActionResults(parentActions, action, ctx))
    }
  } else if (check(['val', 'ArgList', '(', 'String'])) {
    options = []
    if (app.doc && Object.keys(app.doc).length) {
      options = [...options, ...toOptions(Object.keys(app.doc))]
    }
    if (app.tableId) {
      options = [...options, ...toOptions(app.tableInstance.fields.map((f) => f.name))]
    }
  } else if (check(['table', 'ArgList', '(', 'String'])
    || check(['field', 'ArgList', '(', 'String'])) {
    options = toOptions(editor.tables.map((o) => o.name))
  } else if (check(['field', 'ArgList', '(', 'String', ',', 'String'])) {
    const tokens = tokensBefore(5)
    const tt = tokens[2]
    const n = context.state.doc.slice(tt.from + 1, tt.to - 1).toString()
    const table = editor.tables.find((o) => o.name === n)
    options = toOptions([
      ...(table.fields?.map((f) => f.name) || []),
      ...extraFields(table?.created, table?.updated, table?.softDelete).map((f) => f.name),
    ])
  } else if (check(['var', 'ArgList', '(', 'String'])) {
    options = toOptions(variables.names)
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

/**
 * Main Menu
 */

const insertIntoCode = (text: string, cursorAdj: number) => {
  if (!text) {
    return
  }
  const { selection } = view.value.state
  const { from, to } = selection.main
  view.value.dispatch({
    changes: {
      from,
      to,
      insert: text,
    },
    selection: {
      anchor: to + text.length + cursorAdj,
    },
  })
  view.value.contentDOM.focus()
}
</script>

<style scoped lang="sass">
.mainmenu
  width: 250px
  height: 100%
  overflow: auto
</style>

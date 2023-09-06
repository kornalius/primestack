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
import { marked } from 'marked'
import { SyntaxNode } from '@lezer/common'
import { CompletionContext, autocompletion, Completion } from '@codemirror/autocomplete'
import { syntaxTree } from '@codemirror/language'
import { json } from '@codemirror/lang-json'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useModelValue } from '@/composites/prop'
import { useAppEditor } from '@/features/App/store'
import { useVariables } from '@/features/Variables/store'
import { extraFields } from '@/shared/schema'

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

const fcts = {
  str: '',

  doc: '`(key: string): unknown`\n\n'
    + 'Returns value from the current document in the form',

  var: '`(name: string, value?: unknown): unknown`\n\n'
    + 'Sets and/or returns the value of a variable',

  field: '`(tablename: string, fieldname: string): unknown`\n\n'
    + 'Returns the ID of a field in a table',

  table: '`(name: string): string`\n\n'
    + 'Returns the ID of a table',

  route: '`(): string`\n\n'
    + ' Returns the current route/url',

  param: '`(key: string, value?: string): string`\n\n'
    + 'Sets and/or returns a parameter in the current route/url',

  now: '`(): number`\n\n'
    + 'Returns the current time in milliseconds since the epoch',

  log: '`(...args: unknown)`\n\n'
    + 'Logs something to the browser console',

  error: '`(...args: unknown)`\n\n'
    + 'Logs something to the browser console as an error',

  info: '`(...args: unknown)`\n\n'
    + 'Logs something to the browser console as an information',

  warn: '`(...args: unknown)`\n\n'
    + 'Logs something to the browser console as a warning',

  localStorage: '`(key: string, value?: string): string`\n\n'
    + 'Sets and/or returns the value of a localStorage key',

  parse: '`(s: string): unknown`\n\n'
    + 'Parse a string into an object',

  stringify: '`(o: unknown, beautify?: boolean): string`\n\n'
    + 'Stringify an object into a string, optionally beautifying it in the process',

  join: '`(a: string[], by: string): string`\n\n'
    + 'Joins an array of string into one string',

  date: '`(d: string | number, template?: string): Date`\n\n'
    + ' Returns a Date object from a string or number',

  format: '`(d: Date, format: string): string`\n\n'
    + 'Formats a Date object into a string\n\n'
    + '**List of all available parsing tokens**\n'
    + '|Input|Example|Description|\n'
    + '|:----|:------|:----------|\n'
    + '|YY|01|Two-digit year|\n'
    + '|YYYY|2001|Four-digit year|\n'
    + '|M|1-12|Month, beginning at 1|\n'
    + '|MM|01-12|Month, 2-digits|\n'
    + '|MMM|Jan-Dec|The abbreviated month name|\n'
    + '|MMMM|January-December|The full month name|\n'
    + '|D|1-31|Day of month|\n'
    + '|DD|01-31|Day of month, 2-digits|\n'
    + '|H|0-23|Hours|\n'
    + '|HH|00-23|Hours, 2-digits|\n'
    + '|h|1-12|Hours, 12-hour clock|\n'
    + '|hh|01-12|Hours, 12-hour clock, 2-digits|\n'
    + '|m|0-59|Minutes|\n'
    + '|mm|00-59|Minutes, 2-digits|\n'
    + '|s|0-59|Seconds|\n'
    + '|ss|00-59|Seconds, 2-digits|\n'
    + '|S|0-9|Hundreds of milliseconds, 1-digit|\n'
    + '|SS|00-99|Tens of milliseconds, 2-digits|\n'
    + '|SSS|000-999|Milliseconds, 3-digits|\n'
    + '|Z|-05:00|Offset from UTC|\n'
    + '|ZZ|-0500|Compact offset from UTC, 2-digits|\n'
    + '|A|AM PM|Post or ante meridiem, upper-case|\n'
    + '|a|am pm|Post or ante meridiem, lower-case|\n'
    + '|Do|1st... 31st|Day of Month with ordinal|\n'
    + '|X|1410715640.579|Unix timestamp|\n'
    + '|x|1410715640579|Unix ms timestamp|\n',

  second: '`(d: Date): number`\n\n'
    + 'Gets the seconds from a date',

  millisecond: '`(d: Date): number`\n\n'
    + 'Gets the milliseconds from a date',

  minute: '`(d: Date): number`\n\n'
    + 'Gets the minutes from a date',

  hour: '`(d: Date): number`\n\n'
    + 'Gets the hours from a date',

  day: '`(d: Date): number`\n\n'
    + 'Gets the day of a date',

  weekday: '`(d: Date): number`\n\n'
    + 'Gets the weekday of a date (0 Sunday - 6 Saturday)',

  month: '`(d: Date): number`\n\n'
    + 'Gets the month from a date (0 January - 11 December)',

  year: '`(d: Date): number`\n\n'
    + 'Gets the year from a date',

  week: '`(d: Date): number`\n\n'
    + 'Gets the week of a date (0 - 51)',

  dayOfYear: '`(d: Date): number`\n\n'
    + 'Gets the day of the year of a date (1 - 366)',

  quarter: '`(d: Date): number`\n\n'
    + 'Gets the quarter of a date (1 - 3)',

  daysInMonth: '`(d: Date): number`\n\n'
    + 'Gets the number of days in the month of a date (1 - 31)',

  dateMax: '`(dates: Date[]): Date`\n\n'
    + 'Returns the biggest date in the array of dates',

  dateMin: '`(dates: Date[]): Date`\n\n'
    + 'Returns the lowest date in the array of dates',

  add: '`(d: Date, count: number, unit: string): Date`\n\n'
    + 'Adds a number of units to a date\n\n'
    + '**List of all available units**\n'
    + '|Unit|Shorthand|Description|\n'
    + '|:---|:--------|:----------|\n'
    + '|day|d|Day|\n'
    + '|week|w|Week|\n'
    + '|month|M|Month|\n'
    + '|quarter|Q|Quarter ( dependent QuarterOfYear plugin )|\n'
    + '|year|y|Year|\n'
    + '|hour|h|Hour|\n'
    + '|minute|m|Minute|\n'
    + '|second|s|Second|\n'
    + '|millisecond|ms|Millisecond|\n',

  subtract: '`(d: Date, count: number, unit: string): Date`\n\n'
    + 'Subtracts a number of units to a date\n\n'
    + '**List of all available units**\n'
    + '|Unit|Shorthand|Description|\n'
    + '|:---|:--------|:----------|\n'
    + '|day|d|Day|\n'
    + '|week|w|Week|\n'
    + '|month|M|Month|\n'
    + '|quarter|Q|Quarter ( dependent QuarterOfYear plugin )|\n'
    + '|year|y|Year|\n'
    + '|hour|h|Hour|\n'
    + '|minute|m|Minute|\n'
    + '|second|s|Second|\n'
    + '|millisecond|ms|Millisecond|\n',

  startOf: '`(d: Date, unit: string): Date`\n\n'
    + 'Returns the start of a unit in a date\n'
    + '**List of all available units**\n'
    + '|Unit|Shorthand|Description|\n'
    + '|:---|:--------|:----------|\n'
    + '|year|y|January 1st, 00:00 this year|\n'
    + '|quarter|Q|beginning of the current quarter, 1st day of months, 00:00 '
    + '( dependent QuarterOfYear plugin )|\n'
    + '|month|M|the first day of this month, 00:00|\n'
    + '|week|w|the first day of this week, 00:00 (locale aware)|\n'
    + '|isoWeek||the first day of this week according to ISO 8601, 00:00 '
    + '( dependent IsoWeek plugin )|\n'
    + '|date|D|00:00 today|\n'
    + '|day|d|00:00 today|\n'
    + '|hour|h|now, but with 0 mins, 0 secs, and 0 ms|\n'
    + '|minute|m|now, but with 0 seconds and 0 milliseconds|\n'
    + '|second|s|now, but with 0 milliseconds|\n',

  endOf: '`(d: Date, unit: string): Date`\n\n'
    + 'Returns the end of a unit in a date\n'
    + '**List of all available units**\n'
    + '|Unit|Shorthand|Description|\n'
    + '|:---|:--------|:----------|\n'
    + '|year|y|January 1st, 00:00 this year|\n'
    + '|quarter|Q|beginning of the current quarter, 1st day of months, 00:00 '
    + '( dependent QuarterOfYear plugin )|\n'
    + '|month|M|the first day of this month, 00:00|\n'
    + '|week|w|the first day of this week, 00:00 (locale aware)|\n'
    + '|isoWeek||the first day of this week according to ISO 8601, 00:00 '
    + '( dependent IsoWeek plugin )|\n'
    + '|date|D|00:00 today|\n'
    + '|day|d|00:00 today|\n'
    + '|hour|h|now, but with 0 mins, 0 secs, and 0 ms|\n'
    + '|minute|m|now, but with 0 seconds and 0 milliseconds|\n'
    + '|second|s|now, but with 0 milliseconds|\n',

  relative: '`(d: Date, withoutSuffix?: boolean): string`\n\n'
    + 'Returns the string of relative time from now',

  diff: '`(d1: Date, d2: Date): Date`\n\n'
    + 'Get the difference between `d2` and `d1`\n\n'
    + '**List of all available units**\n'
    + '|Unit|Shorthand|Description|\n'
    + '|:---|:--------|:----------|\n'
    + '|day|d|Day|\n'
    + '|week|w|Week|\n'
    + '|month|M|Month|\n'
    + '|quarter|Q|Quarter ( dependent QuarterOfYear plugin )|\n'
    + '|year|y|Year|\n'
    + '|hour|h|Hour|\n'
    + '|minute|m|Minute|\n'
    + '|second|s|Second|\n'
    + '|millisecond|ms|Millisecond|\n',

  before: '`(d1: Date, d2: Date): boolean`\n\n'
    + 'Checks if `d2` is before `d1`',

  after: '`(d1: Date, d2: Date): boolean`\n\n'
    + 'Checks if `d2` is after `d1`',

  same: '`(d1: Date, d2: Date): boolean`\n\n'
    + 'Checks if `d2` is the same `d1`',

  sameOrBefore: '`(d1: Date, d2: Date): boolean`\n\n'
    + 'Checks if `d2` is the same or before `d1`',

  sameOrAfter: '`(d1: Date, d2: Date): boolean`\n\n'
    + 'Checks if `d2` is the same of after `d1`',

  leap: '`(d: Date): boolean`\n\n'
    + 'Checks if the year of `d1` is leap',

  uppercase: '`(s: string): string`\n\n'
    + 'Transforms the casing of a string to upper characters',

  lowercase: '`(s: string): string`\n\n'
    + 'Transforms the casing of a string to lower characters',

  camelcase: '`(s: string): string`\n\n'
    + 'Transforms the casing of a string to camelcase\n\n'
    + 'ex: `to-camel-case` becomes `toCamelCase`'
    + 'ex: `to_camel_case` becomes `toCamelCase`',

  snakecase: '`(s: string): string`\n\n'
    + 'Transforms the casing of a string to snakecase\n\n'
    + 'ex: `toSnakeCase` becomes `to_snake_case`',

  kebabcase: '`(s: string): string`\n\n'
    + 'Transforms the casing of a string to kebabcase\n\n'
    + 'ex: `toKebabCase` becomes `to-kebab-case`',

  capitalize: '`(s: string): string`\n\n'
    + 'Transforms the first character of a string to uppercase\n\n'
    + 'ex: `capitilizethis` becomes `Capitalizethis`',

  isNull: '`(value: unknown): boolean`\n\n'
    + 'Checks if value is null',

  isNil: '`(value: unknown): boolean`\n\n'
    + 'Checks if value is nullish (null or undefined)',

  isUndefined: '`(value: unknown): boolean`\n\n'
    + 'Checks if value is undefined',

  max: '`(...values: number): number`\n\n'
    + 'Gets the highest number from a list of values',

  min: '`(...values: number): number`\n\n'
    + 'Gets the lowest number from a list of values',

  round: '`(value: number, precision = 0): number`\n\n'
    + 'Rounds a value to precision',

  floor: '`(value: number, precision = 0): number`\n\n'
    + 'Rounds down a value to precision',

  ceil: '`(value: number, precision = 0): number`\n\n'
    + 'Rounds up a value to precision',

  clamp: '`(value: number, lower?: number, upper?: number): number`\n\n'
    + 'Clamps a value within the inclusive `lower` and `upper` bounds',

  inRange: '`(value: number, start?: number, end?: number): number`\n\n'
    + 'Checks if value is between `start` and up to, but not including, `end`'
    + 'If end is not specified, it\'s set to start with start then set to 0.'
    + 'If start is greater than end the params are swapped to support negative ranges',

  random: '`(lower = 0, upper = 1, floating?: boolean): number`\n\n'
    + 'Produces a random number between the inclusive lower and upper bounds. '
    + 'If only one argument is provided a number between 0 and the given number is returned. '
    + 'If floating is true, or either lower or upper are floats, a floating-point number '
    + 'is returned instead of an integer',

  get: '`(object: unknown, path: string, defaultValue?: unknown): unknown`\n\n'
    + 'Gets the value at path of object. If the resolved value is undefined, '
    + 'the defaultValue is returned in its place',

  set: '`(object: unknown, path: string, value: unknown)`\n\n'
    + 'Sets the value at path of object. If a portion of path doesn\'t exist, it\'s created. '
    + 'Arrays are created for missing index properties while objects are created for all '
    + 'other missing properties. Use _.setWith to customize path creation',

  merge: '`(object: unknown, ...sources: unknown[]): unknown`\n\n'
    + 'It recursively merges own and inherited enumerable string keyed properties of '
    + 'source objects into the destination object. Source properties that resolve to '
    + 'undefined are skipped if a destination value exists. Array and plain object properties '
    + 'are merged recursively. Other objects and value types are overridden by assignment. '
    + 'Source objects are applied from left to right. Subsequent sources overwrite property '
    + 'assignments of previous sources',

  pick: '`(object: unknown, paths: string[]): unknown`\n\n'
    + 'Creates an object composed of the picked object properties',

  omit: '`(object: unknown, paths: string[]): unknown`\n\n'
    + 'Creates an object composed of the own and inherited enumerable property paths '
    + 'of object that are not omitted',

  pad: '`(s: string, length = 0, chars = \' \'): string`\n\n'
    + 'Pads `s` on the left and right sides if it\'s shorter than `length`. '
    + 'Padding characters are truncated if they can\'t be evenly divided by `length`',

  padStart: '`(s: string, length = 0, chars = \' \'): string`\n\n'
    + 'Pads `s` on the left side if it\'s shorter than `length`. '
    + 'Padding characters are truncated if they can\'t be evenly divided by `length`',

  padEnd: '`(s: string, length = 0, chars = \' \'): string`\n\n'
    + 'Pads `s` on the right side if it\'s shorter than `length`. '
    + 'Padding characters are truncated if they can\'t be evenly divided by `length`',

  startsWith: '`(s: string, target?: string, position = 0): boolean`\n\n'
    + 'Checks if `s` starts with the given `target` string',

  endsWith: '`(s: string, target?: string, position = 0): boolean`\n\n'
    + 'Checks if `s` ends with the given `target` string',

  trim: '`(s: string, chars = \' \'): string`\n\n'
    + 'Removes leading and trailing `chars` or specified characters from `s`',

  escape: '`(s: string): string`\n\n'
    + 'Converts the characters "&", "<", ">", \'"\', and "\'" in string to their '
    + 'corresponding HTML entities',

  unescape: '`(s: string): string`\n\n'
    + 'converts the HTML entities &amp;, &lt;, &gt;, &quot;, and &#39; in string to their '
    + 'corresponding characters',

  repeat: '`(s: string, count = 1): string`\n\n'
    + 'Repeats the given string `s` `count` times',

  split: '`(s: string, separator: string, limit?: number): string[]`\n\n'
    + 'Splits string `s` by `separator`. Limit the results to `limit` if specified',

  replace: '`(s: string, pattern: string, replacement: string): string`\n\n'
    + 'Replaces matches for `pattern` in string `s` with `replacement`',
}

marked.use({
  breaks: true,
  gfm: true,
})

const toOptions = (opts: string[], type = 'keyword'): Completion[] => (
  opts.map((k) => ({
    label: k,
    type,
    info: fcts[k] ? () => {
      const el = document.createElement('div')
      el.innerHTML = marked.parse(fcts[k])
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
    options = toOptions([
      ...(table.fields?.map((f) => f.name) || []),
      ...extraFields(table?.created, table?.updated, table?.softDelete).map((f) => f.name),
    ])
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

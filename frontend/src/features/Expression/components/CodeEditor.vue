<template>
  <div class="row">
    <div class="col-auto mainmenu">
      <code-menu
        :model-value="mainmenu"
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
import { computed, shallowRef } from 'vue'
import sortBy from 'lodash/sortBy'
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
import { useFeathersService } from '@/composites/feathers'
import { Menu } from '../interfaces'
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

const { buildCtx } = useExpression()

const ctx = buildCtx()

const { t } = useI18n()

const fcts = {
  $result: '`(path?: string): unknown | undefined`\n\n'
    + 'Get the previous action result value',

  str: '`(format: string, data: object): string`\n\n'
    + 'Formats a string with format specifiers (subsequences beginning with %), \n'
    + 'the additional arguments following format are formatted and inserted in \n'
    + 'the resulting string replacing their respective specifiers.\n\n'

    + 'A format specifier follows this prototype:\n'
    + '`%[flags][width][.precision][length]specifier`\n\n'

    + 'Where the specifier character at the end is the most significant component, \n'
    + 'since it defines the type and the interpretation of its corresponding argument:\n\n'

    + '|specifier|Output|Example|\n'
    + '|:--------|:-----|:------|\n'
    + '|`d` or `i`|Signed decimal integer|`392`|\n'
    + '|`u`|Unsigned decimal integer|`7235`|\n'
    + '|`o`|Unsigned octal|`610`|\n'
    + '|`x`|Unsigned hexadecimal integer|`7fa`|\n'
    + '|`X`|Unsigned hexadecimal integer (uppercase)|`7FA`|\n'
    + '|`f`|Decimal floating point, lowercase|`392.65`|\n'
    + '|`F`|Decimal floating point, uppercase|`392.65`|\n'
    + '|`e`|Scientific notation (mantissa/exponent), lowercase|`3.9265e+2`|\n'
    + '|`E`|Scientific notation (mantissa/exponent), uppercase|`3.9265E+2`|\n'
    + '|`g`|Use the shortest representation: %e or %f|`392.65`|\n'
    + '|`G`|Use the shortest representation: %E or %F|`392.65`|\n'
    + '|`a`|Hexadecimal floating point, lowercase|`-0xc.90fep-2`|\n'
    + '|`A`|Hexadecimal floating point, uppercase|`-0XC.90FEP-2`|\n'
    + '|`c`|Character|`a`|\n'
    + '|`s`|String of characters|`sample`|\n'
    + '|`p`|Pointer address|`b8000000`|\n'
    + '|`n`|Nothing printed. '
    + 'The corresponding argument must be a pointer to a signed int. '
    + 'The number of characters written so far is stored in the pointed location.||\n'
    + '|`%`|A `%` followed by another `%` character will write a single `%` to the stream.|`%`|\n\n'

    + 'The format specifier can also contain sub-specifiers: `flags`, `width`, `.precision` \n'
    + 'and modifiers (in that order), which are optional and follow these specifications:\n\n'

    + '|flags|description|\n'
    + '|:----|:----------|\n'
    + '|`-`|Left-justify within the given field width; Right justification is the default.|\n'
    + '|`+`|Forces to preceed the result with a plus or minus sign (+ or -) even for positive '
    + 'numbers. By default, only negative numbers are preceded with a `-` sign.|\n'
    + '|`(space)`|If no sign is going to be written, a blank space is inserted before the value.|\n'
    + '|`#`|Used with `o`, `x` or `X` specifiers the value is preceeded with '
    + '`0`, `0x` or `0X` respectively for values different than zero. '
    + 'Used with a, A, e, E, f, F, g or G it forces the written output to contain a decimal '
    + 'point even if no more digits follow. By default, if no digits follow, no decimal '
    + 'point is written.|\n'
    + '|`0`|Left-pads the number with zeroes (0) instead of spaces when padding is specified '
    + '(see width sub-specifier).|\n\n\n'

    + '|width|description|\n'
    + '|:----|:----------|\n'
    + '|`(number)`|Minimum number of characters to be outputed. If the value is shorter than this '
    + 'number, the result is padded with blank spaces. The value is not truncated even if the '
    + 'result is larger.|\n'
    + '|`*`|The width is not specified in the format string, but as an additional integer '
    + 'value argument preceding the argument that has to be formatted.|\n\n'

    + '|.precision|description|\n'
    + '|:---------|:----------|\n'
    + '|`.number`|For integer specifiers (d, i, o, u, x, X): precision specifies the minimum '
    + 'number of digits to be written. If the value to be written is shorter than this number, '
    + 'the result is padded with leading zeros. The value is not truncated even if the result is '
    + 'longer. A precision of 0 means that no character is written for the value 0. '
    + 'For a, A, e, E, f and F specifiers: this is the number of digits to be printed '
    + 'after the decimal point (by default, this is 6). '
    + 'For g and G specifiers: This is the maximum number of significant digits to be printed. '
    + 'For s: this is the maximum number of characters to be printed. By default all '
    + 'characters are printed until the ending null character is encountered. '
    + 'If the period is specified without an explicit value for precision, 0 is assumed.|\n'
    + '|`.*`|The precision is not specified in the format string, but as an additional integer '
    + 'value argument preceding the argument that has to be formatted.|\n\n'

    + 'The length sub-specifier modifies the length of the data type. This is a chart showing '
    + 'the types used to interpret the corresponding arguments with and without length specifier '
    + '(if a different type is used, the proper type promotion or conversion is performed, '
    + 'if allowed):\n\n'

    + '| |specifiers|  |  |  |  |  |\n'
    + '|-|:---------|:-|:-|:-|:-|:-|\n'
    + '|`length`|`d i`|`u o x X`|`f F e E g G a A`|`c`|`s`|`n`|\n'
    + '|`(none)`|`number`|`number`|`number`|`number`|`string`|`number`|\n'
    + '|`hh`|`string`|`string`||||`string`|\n'
    + '|`h`|`number`|`number`||||`number`|\n'
    + '|`l`|`number`|`number`||`number`|`string`|`number`|\n'
    + '|`ll`|`number`|`number`||||`number`|\n'
    + '|`j`|`number`|`number`||||`number`|\n'
    + '|`z`|`number`|`number`||||`number`|\n'
    + '|`t`|`number`|`number`||||`number`|\n'
    + '|`L`|||`number`||||\n\n'

    + '**Example**\n'
    + '```js\n'
    + 'str(\'Characters: %string:c %number:c\', { string: \'a\', number: 65 })\n'
    + 'str(\'Decimals: %n:d %long:ld\', { n: 1977, long: 650000L })\n'
    + 'str(\'Preceding with blanks: %n:10d\', { n: 1977 })\n'
    + 'str(\'Preceding with zeros: %n:010d\', { n: 1977 })\n'
    + 'str(\'Some different radices: %a:d %b:x %c:o %d:#x %e:#o\', '
    + '{ a: 100, b: 100, c: 100, d: 100, e: 100 })\n'
    + 'str(\'floats: %a:4.2f %b:+.0e %c:E\', { a: 3.1416, b: 3.1416, c: 3.1416 })\n'
    + 'str(\'%a:s\', { a: \'A string\' })\n'
    + '```\n\n'

    + '**Output:**\n'
    + '```\n'
    + 'Characters: a A\n'
    + 'Decimals: 1977 650000\n'
    + 'Preceding with blanks:       1977\n'
    + 'Preceding with zeros: 0000001977\n'
    + 'Some different radices: 100 64 144 0x64 0144\n'
    + 'floats: 3.14 +3e+000 3.141600E+000\n'
    + 'A string\n'
    + '```\n',

  val: '`(key: string): unknown`\n\n'
    + 'Returns value from the current document in the form',

  var: '`(name: string): unknown`\n\n'
    + 'Returns the value of a variable',

  field: '`(tablename: string, fieldname: string): unknown`\n\n'
    + 'Returns the ID of a field in a table',

  table: '`(name: string): string`\n\n'
    + 'Returns the ID of a table',

  route: '`(): string`\n\n'
    + ' Returns the current route/url',

  param: '`(key: string): string`\n\n'
    + 'Returns a parameter in the current route/url',

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

  localStorage: '`(key: string): string`\n\n'
    + 'Returns the value of a localStorage key',

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

    + '**List of all available units**\n\n'

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

    + '**List of all available units**\n\n'

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
    + 'Returns the start of a unit in a date\n\n'

    + '**List of all available units**\n\n'

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
    + 'Returns the end of a unit in a date\n\n'

    + '**List of all available units**\n\n'

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

    + '**List of all available units**\n\n'

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

  menuId: '`(): string`\n\n'
    + 'Returns the current menu id',

  tabId: '`(): string`\n\n'
    + 'Returns the current tab id',

  formId: '`(): string`\n\n'
    + 'Returns the current form id',

  tableId: '`(): string`\n\n'
    + 'Returns the current table id',

  selection: '`(): unknown[]`\n\n'
    + 'Returns the current table selected rows',
}

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

const userTable = useFeathersService('tables')
  .findOneInStore({ query: {} })

const userForm = useFeathersService('forms')
  .findOneInStore({ query: {} })

const userMenu = useFeathersService('menus')
  .findOneInStore({ query: {} })

const functions = computed((): Menu[] => (
  Object.keys(fcts).sort().map((k) => ({
    icon: 'mdi-flash',
    name: k,
    label: k,
    value: `${k}()`,
    cursorAdj: -1,
    tooltip: fcts[k],
  }))
))

const tables = computed((): Menu[] => (
  sortBy((userTable.value?.list || []).map((table) => ({
    icon: 'mdi-table',
    name: table._id,
    label: table.name,
    value: `table('${table.name}')`,
  })), 'label')
))

const menus = computed((): Menu[] => (
  sortBy((userMenu.value?.list || []).map((menu) => ({
    icon: 'mdi-menu',
    name: menu._id,
    label: menu.label || menu.name,
    value: `menu('${menu.name}')`,
  })), 'label')
))

const tabs = computed((): Menu[] => (
  sortBy((userMenu.value?.list || []).reduce((acc, menu) => ([
    ...acc,
    ...menu.tabs.map((tab) => ({
      icon: 'mdi-tab',
      name: tab._id,
      label: `${menu.label || menu.name} > ${tab.label}`,
      value: `tab('${menu.name}')`,
    })),
  ]), []), 'label')
))

const forms = computed((): Menu[] => (
  sortBy((userForm.value?.list || []).map((form) => ({
    icon: 'mdi-window-maximize',
    name: form._id,
    label: form.name,
    value: `form('${form.name}')`,
  })), 'label')
))

const fields = computed((): Menu[] => (
  sortBy((userTable.value?.list || []).reduce((acc, table) => ([
    ...acc,
    ...table.fields.map((field) => ({
      icon: 'mdi-form-textbox',
      name: field._id,
      label: `${table.name} > ${field.name}`,
      value: `field('${table.name}', '${field.name}')`,
    })),
  ]), []), 'label')
))

const mainmenu = computed((): Menu[] => ([
  {
    icon: 'mdi-flash',
    name: 'functions',
    label: t('code_editor.menus.functions'),
    children: functions.value,
  },
  {
    icon: 'mdi-menu',
    name: 'menus',
    label: t('code_editor.menus.menus'),
    children: menus.value,
  },
  {
    icon: 'mdi-tab',
    name: 'tabs',
    label: t('code_editor.menus.tabs'),
    children: tabs.value,
  },
  {
    icon: 'mdi-window-maximize',
    name: 'forms',
    label: t('code_editor.menus.forms'),
    children: forms.value,
  },
  {
    icon: 'mdi-table',
    name: 'tables',
    label: t('code_editor.menus.tables'),
    children: tables.value,
  },
  {
    icon: 'mdi-form-textbox',
    name: 'fields',
    label: t('code_editor.menus.fields'),
    children: fields.value,
  },
]))

const insertIntoCode = (text: string, cursorAdj: number) => {
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

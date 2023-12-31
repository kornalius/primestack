export const fcts = {
  $result: '`(path?: string): unknown | undefined`\n\n'
    + 'Get the previous action result value',

  link: '`(menuId: string, tabId?: string, formId?: string, create?: boolean): string`\n\n'
    + 'Returns a url that points to the menuId, tabId, formId specified',

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

  doc: '`(): unknown`\n\n'
    + 'Returns currently selected document',

  variable: '`(name: string): unknown`\n\n'
    + 'Returns the value of a variable',

  field: '`(tablename: string, fieldname: string): unknown`\n\n'
    + 'Returns the ID of a field in a table',

  table: '`(name: string): string`\n\n'
    + 'Returns the ID of a table',

  dialogData: '`(): AnyData`\n\n'
    + 'Returns the previously displayed dialog data',

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

  fromNow: '`(d: Date, withoutSuffix?: boolean): string`\n\n'
    + 'Returns the string of relative time from now to a date in the future',

  toNow: '`(d: Date, withoutSuffix?: boolean): string`\n\n'
    + 'Returns the string of relative time from now from a date in the past',

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

  isArray: '`(value: unknown): boolean`\n\n'
    + 'Returns whether the passed value is an Array',

  concat: '`(arr: unknown[], ...items: unknown[]): unknown[]`\n\n'
    + 'Returns a new array that is the calling array joined with other array(s) and/or value(s)',

  flat: '`(arr: unknown[]): unknown[]`\n\n'
    + 'Returns a new array with all sub-array elements concatenated into it recursively up '
    + 'to the specified depth',

  indexOf: '`(arr: unknown[], value: unknown): unknown[]`\n\n'
    + 'Returns the first (least) index at which a given element can be found in the calling array',

  reverse: '`(arr: unknown[]): unknown[]`\n\n'
    + 'Reverses the order of the elements of an array in place. '
    + '(First becomes the last, last becomes first.)',

  push: '`(arr: unknown[], value: unknown): unknown[]`\n\n'
    + 'Adds one or more elements to the end of an array, and returns the new array',

  shift: '`(arr: unknown[]): unknown[]`\n\n'
    + 'Removes the first element from an array and returns the new array',

  pop: '`(arr: unknown[]): unknown[]`\n\n'
    + 'Removes the last element from an array and returns the new array',

  unshift: '`(arr: unknown[], value: unknown): unknown[]`\n\n'
    + 'Adds one or more elements to the front of an array, and returns the new array',

  slice: '`(arr: unknown[], start?: number, end?: number): unknown[]`\n\n'
    + 'Extracts a section of the calling array and returns a new array',

  splice: '`(arr: unknown[], start: number, count?: number, ...items: unknown[]): unknown[]`\n\n'
    + 'Adds and/or removes elements from an array, returns the array',

  isNaN: '`(value: number): boolean`\n\n'
    + 'Returns whether a value is NaN, first converting the value to a number if necessary',

  isInteger: '`(value: number): boolean`\n\n'
    + 'Returns whether the passed value is an integer',

  isFinite: '`(value: number): boolean`\n\n'
    + 'Returns whether the passed value is a finite number',

  PI: '`(): number`\n\n'
    + 'Returns the ratio of a circle\'s circumference to its diameter; approximately 3.14159',

  MAX_FLOAT: '`(): number`\n\n'
    + 'Returns the largest positive representable number',

  MAX_INT: '`(): number`\n\n'
    + 'Returns the maximum safe integer in JavaScript (253 - 1)',

  parseInt: '`(value: string): number`\n\n'
    + '',

  parseFloat: '`(value: string): number`\n\n'
    + 'Parses an argument and returns a floating point number. If a number cannot be '
    + 'parsed from the argument, it returns NaN',

  toFixed: '`(value: number, digits: number): string`\n\n'
    + 'Formats a number using fixed-point notation',

  toLocale: '`(value: number, locale?: string, opt?: Intl.NumberFormatOptions): string`\n\n'
    + 'Returns a string with a language-sensitive representation of this number',

  toString: '`(value: unknown): string`\n\n'
    + 'Returns a string representation of a value',

  abs: '`(value: number): number`\n\n'
    + 'Returns the absolute of a value',

  acos: '`(value: number): number`\n\n'
    + 'Returns the arccosine of a value',

  cos: '`(value: number): number`\n\n'
    + 'Returns the cosine of a value',

  asin: '`(value: number): number`\n\n'
    + 'Returns the arcsine of a value',

  sin: '`(value: number): number`\n\n'
    + 'Returns the sine of a value',

  atan: '`(value: number): number`\n\n'
    + 'Returns the arctangent',

  tan: '`(value: number): number`\n\n'
    + 'Returns the hyperbolic tangent of a value',

  pow: '`(x: number, y: number): number`\n\n'
    + 'Returns base x to the exponent power y (that is, xy)',

  sign: '`(value: number): number`\n\n'
    + 'Returns the sign of the value, indicating whether value is positive, negative, or zero',

  sqrt: '`(value: number): number`\n\n'
    + 'Returns the positive square root of a value',

  trunc: '`(value: number): number`\n\n'
    + 'Returns the integer portion of a value, removing any fractional digits',

  logarithm: '`(value: number): number`\n\n'
    + 'Returns the natural logarithm (㏒e; also, ㏑)',

  entries: '`(value: unknown): [string, unknown][]`\n\n'
    + 'Returns an array containing all of the [key, value] pairs of a given object\'s own '
    + 'enumerable string properties',

  keys: '`(value: unknown): string[]`\n\n'
    + 'Returns an array containing the names of all of the given object\'s own '
    + 'enumerable string properties',

  values: '`(value: unknown): unknown[]`\n\n'
    + 'Returns an array containing the values that correspond to all of a given object\'s own '
    + 'enumerable string properties',

  has: '`(value: unknown, key: string): boolean`\n\n'
    + 'Returns true if the specified object has the indicated key as its own property, '
    + 'or false if the key is inherited or does not exist',

  chr: '`(value: number): string`\n\n'
    + 'Returns a string created by using the specified Unicode value',

  length: '`(value: string): number`\n\n'
    + 'Returns the length of the string',

  at: '`(value: string): number`\n\n'
    + 'Returns the character (exactly one UTF-16 code unit) at the specified index. '
    + 'Accepts negative integers, which count back from the last string character',

  append: '`(value: string, append: string): string`\n\n'
    + 'Combines the text of two (or more) strings and returns a new string',

  index: '`(value: string, searchValue: string): number`\n\n'
    + 'Returns the index of the first occurrence of searchValue, or -1 if not found',

  indexLast: '`(value: string, searchValue: string): number`\n\n'
    + 'Returns the index of the last occurrence of searchValue, or -1 if not found',

  compare: '`(value: string, str: string, locale?: string, opt?: Intl.CollatorOptions): number`\n\n'
    + 'Returns a number indicating whether the reference string compare comes before, after, '
    + 'or is equivalent to the given string in sort order',

  normalize: '`(value: string): string`\n\n'
    + 'Returns the Unicode Normalization Form of the string value',

  substring: '`(value: string): string`\n\n'
    + 'Returns a new string containing characters of the string from (or between) the specified '
    + 'index (or indices)',

  user: '`(name: string): string | undefined`\n\n'
    + 'Returns currently logged user\'s information\n\n'
    + 'Possible name values: email, firstname, lastname, locale',

  setting: '`(name: string): string | undefined`\n\n'
    + 'Returns currently logged user\'s setting key value\n\n',

  uniqueId: '`(): string`\n\n'
    + 'Returns a unique id',

  nextNo: '`(previousNo: string): string`\n\n'
    + 'Returns the next sequential number from a previous one',

  map: '`(array: AnyData[], keys: string[] | string): unknown[]`\n\n'
    + 'Returns a new array of objects by extracting specific keys from values',

  domain: '`(urlOrEmail: string): string | undefined`\n\n'
    + 'Returns the domain part of a Url or Email string',
}

`(format: string, data: object): string`
Formats a string with format specifiers (subsequences beginning with %), the additional arguments following format are formatted and inserted in the resulting string replacing their respective specifiers.

A format specifier follows this prototype:
  `%[flags][width][.precision][length]specifier`

Where the specifier character at the end is the most significant component, since it defines the type and the interpretation of its corresponding argument:

| specifier  | Output                                             | Example        |
|:-----------|:---------------------------------------------------|:---------------|
| `d` or `i` | Signed decimal integer                             | `392`          |
| `u`        | Unsigned decimal integer                           | `7235`         |
| `o`        | Unsigned octal                                     | `610`          |
| `x`        | Unsigned hexadecimal integer                       | `7fa`          |
| `X`        | Unsigned hexadecimal integer (uppercase)           | `7FA`          |
| `f`        | Decimal floating point, lowercase                  | `392.65`       |
| `F`        | Decimal floating point, uppercase                  | `392.65`       |
| `e`        | Scientific notation (mantissa/exponent), lowercase | `3.9265e+2`    |
| `E`        | Scientific notation (mantissa/exponent), uppercase | `3.9265E+2`    |
| `g`        | Use the shortest representation: %e or %f          | `392.65`       |
| `G`        | Use the shortest representation: %E or %F          | `392.65`       |
| `a`        | Hexadecimal floating point, lowercase              | `-0xc.90fep-2` |
| `A`        | Hexadecimal floating point, uppercase              | `-0XC.90FEP-2` |
| `c`        | Character                                          | `a`            |
| `s`        | String of characters                               | `sample`       |
| `p`        | Pointer address                                    | `b8000000`     |
| `n`        | Nothing printed.                                   |                |

The corresponding argument must be a pointer to a signed int. The number of characters written so far is stored in the pointed location.

| flags | description                                                                    |     |
|-------|--------------------------------------------------------------------------------|-----|
| `%`   | A `%` followed by another `%` character will write a single `%` to the stream. | `%` |

The format specifier can also contain sub-specifiers: `flags`, `width`, `.precision` and modifiers (in that order), which are optional and follow these specifications:

| flags                                                                    | description                                                                                                 |
|:-------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------|
| `-`                                                                      | Left-justify within the given field width; Right justification is the default.                              |
| `+`                                                                      | Forces to preceed the result with a plus or minus sign (+ or -) even for positive '                         |
| numbers. By default, only negative numbers are preceded with a `-` sign. |                                                                                                             |
| `(space)`                                                                | If no sign is going to be written, a blank space is inserted before the value.                              |
| `#`                                                                      | Used with `o`, `x` or `X` specifiers the value is preceeded with '                                          | `0`, `0x` or `0X` respectively for values different than zero. Used with a, A, e, E, f, F, g or G it forces the written output to contain a decimal point even if no more digits follow. By default, if no digits follow, no decimal point is written.|
| `0`                                                                      | Left-pads the number with zeroes (0) instead of spaces when padding is specified (see width sub-specifier). |


| width      | description                                                                                                                                                                             |
|:-----------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `(number)` | Minimum number of characters to be outputed. If the value is shorter than this number, the result is padded with blank spaces. The value is not truncated even if the result is larger. |
| `*`        | The width is not specified in the format string, but as an additional integer value argument preceding the argument that has to be formatted.                                           |

| .precision | description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|:-----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `.number`  | For integer specifiers `d`, `i`, `o`, `u`, `x`, `X`: precision specifies the minimum number of digits to be written. If the value to be written is shorter than this number, the result is padded with leading zeros. The value is not truncated even if the result is longer. A precision of 0 means that no character is written for the value 0. For `a`, `A`, `e`, `E`, `f` and `F` specifiers: this is the number of digits to be printed after the decimal point (by default, this is 6). For `g` and `G` specifiers: This is the maximum number of significant digits to be printed. For `s`: this is the maximum number of characters to be printed. By default all characters are printed until the ending null character is encountered. If the period is specified without an explicit value for precision, 0 is assumed. |
| `.*`       | The precision is not specified in the format string, but as an additional integer value argument preceding the argument that has to be formatted.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |

The length sub-specifier modifies the length of the data type. This is a chart showing '
the types used to interpret the corresponding arguments with and without length specifier '
(if a different type is used, the proper type promotion or conversion is performed, '
if allowed):

|          | specifiers |           |                   |          |          |          |
|----------|:-----------|:----------|:------------------|:---------|:---------|:---------|
| `length` | `d i`      | `u o x X` | `f F e E g G a A` | `c`      | `s`      | `n`      |
| `(none)` | `number`   | `number`  | `number`          | `number` | `string` | `number` |
| `hh`     | `string`   | `string`  |                   |          |          | `string` |
| `h`      | `number`   | `number`  |                   |          |          | `number` |
| `l`      | `number`   | `number`  |                   | `number` | `string` | `number` |
| `ll`     | `number`   | `number`  |                   |          |          | `number` |
| `j`      | `number`   | `number`  |                   |          |          | `number` |
| `z`      | `number`   | `number`  |                   |          |          | `number` |
| `t`      | `number`   | `number`  |                   |          |          | `number` |
| `L`      |            |           | `number`          |          |          |          |

#### Example
```js
str('Characters: %string:c %number:c', { string: 'a', number: 65 })
str('Decimals: %n:d %long:ld', { n: 1977, long: 650000 })
str('Preceding with blanks: %n:10d', { n: 1977 })
str('Preceding with zeros: %n:010d', { n: 1977 })
str('Some different radices: %a:d %b:x %c:o %d:#x %e:#o, ', { a: 100, b: 100, c: 100, d: 100, e: 100 })
str('floats: %a:4.2f %b:+.0e %c:E', { a: 3.1416, b: 3.1416, c: 3.1416 })
str('%a:s', { a: 'A string' })
```

#### Output:
```
Characters: a A
Decimals: 1977 650000
Preceding with blanks:       1977
Preceding with zeros: 0000001977
Some different radices: 100 64 144 0x64 0144
floats: 3.14 +3e+000 3.141600E+000
A string
```

import {
  StringEnum, TObject, TSchema, Type,
} from '@feathersjs/typebox'
import compact from 'lodash/compact'
import { postalCodes } from '@/features/Validation/helpers'
import { sizeString as gSizeString } from '@/shared/interfaces/commons'
import ExType from '@/shared/extypes'

export interface RuleType {
  name: string
  options?: TSchema
}

export const ruleTypes: RuleType[] = [
  { name: 'required' },
  { name: 'email' },
  { name: 'phone' },
  { name: 'alpha' },
  { name: 'alphanumeric' },
  { name: 'numeric' },
  { name: 'integer' },
  { name: 'float' },
  { name: 'hexadecimal' },
  { name: 'uppercase' },
  { name: 'lowercase' },
  {
    name: 'min',
    options: Type.Object({
      minValue: Type.Number(),
    }),
  },
  {
    name: 'max',
    options: Type.Object({
      maxValue: Type.Number(),
    }),
  },
  {
    name: 'between',
    options: Type.Object({
      minValue: Type.Number(),
      maxValue: Type.Number(),
    }),
  },
  {
    name: 'min-length',
    options: Type.Object({
      minLength: Type.Number(),
    }),
  },
  {
    name: 'max-length',
    options: Type.Object({
      maxLength: Type.Number(),
    }),
  },
  {
    name: 'regex',
    options: Type.Object({
      value: Type.String(),
      caseSensitive: Type.Boolean(),
    }),
  },
  {
    name: 'before',
    options: Type.Object({
      date: ExType.Date(),
    }),
  },
  {
    name: 'after',
    options: Type.Object({
      date: ExType.Date(),
    }),
  },
  {
    name: 'creditcard',
    options: Type.Object({
      cardtype: StringEnum([
        'any',
        'amex',
        'dinersclub',
        'discover',
        'jcb',
        'mastercard',
        'unionpay',
        'visa',
      ]),
    }),
  },
  {
    name: 'issn',
    options: Type.Object({
      hyphen: Type.Boolean(),
      caseSensitive: Type.Boolean(),
    }),
  },
  {
    name: 'allow',
    options: Type.Object({
      values: Type.String(),
    }),
  },
  {
    name: 'reject',
    options: Type.Object({
      values: Type.String(),
    }),
  },
  { name: 'ean' },
  { name: 'hexcolor' },
  {
    name: 'isbn',
    options: Type.Object({
      version: StringEnum(['10', '13']),
    }),
  },
  { name: 'json' },
  { name: 'luhn' },
  { name: 'md5' },
  { name: 'semver' },
  {
    name: 'latlong',
    options: Type.Object({
      checkDMS: Type.Boolean(),
    }),
  },
  {
    name: 'postalcode',
    options: Type.Object({
      locale: StringEnum(['current', 'any', ...Object.keys(postalCodes)]),
    }),
  },
]

export const commonProperties = {
  name: Type.Object({
    name: Type.String({ name: true }),
  }),

  field: Type.Object({
    field: ExType.Field(),
  }),

  state: Type.Object({
    disable: Type.Boolean(),
    readonly: Type.Boolean(),
  }),

  style: Type.Object({
    dense: Type.Boolean(),
    border: Type.Object({
      style: Type.String(),
      color: ExType.Color(),
      width: Type.Number(),
      sides: Type.Array(Type.String()),
    }, { style: true, border: true }),
    padding: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { style: true, padding: true }),
    margin: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { style: true, margin: true }),
  }),

  size: Type.Object({
    size: gSizeString,
  }),

  rules: Type.Object({
    rules: Type.Array(
      Type.Object({
        type: StringEnum(ruleTypes.map((r) => r.name)),
      }, { horizontalPopup: true }),
      { rules: true },
    ),
  }),

  events: Type.Object({
    update: ExType.Action(),
    focus: ExType.Action(),
    blur: ExType.Action(),
    keydown: ExType.Action(),
    keypress: ExType.Action(),
    keyup: ExType.Action(),
  }),
}

export const clickEvent = (e: MouseEvent) => ({
  x: e.clientX,
  y: e.clientY,
  shift: e.shiftKey,
  ctrl: e.ctrlKey,
  alt: e.altKey,
  meta: e.metaKey,
})

export const focusEvent = (e: FocusEvent) => ({ relatedTarget: e.relatedTarget })

export const updateEvent = (value: unknown) => ({ value })

export const keyboardEvent = (e: KeyboardEvent) => ({
  key: e.key,
  code: e.code,
  shift: e.shiftKey,
  ctrl: e.ctrlKey,
  alt: e.altKey,
  meta: e.metaKey,
})

export const commonEventArgs = {
  update: updateEvent,
  focus: focusEvent,
  blur: focusEvent,
  keydown: keyboardEvent,
  keypress: keyboardEvent,
  keyup: keyboardEvent,
}

export const defaultStyleValues = {
  border: {
    style: 'none',
    color: 'black',
    width: 1,
    sides: {
      top: 'top',
      bottom: 'bottom',
      left: 'left',
      right: 'right',
    },
    radius: {},
  },
  margin: {},
  padding: {},
}

export const properties = (props: TObject[], field = true) => Type.Intersect(
  compact([
    ...props,
    commonProperties.name,
    field ? commonProperties.field : undefined,
  ]),
)

export const sizeString = gSizeString

import {
  StringEnum, TObject, TSchema, Type,
} from '@feathersjs/typebox'
import compact from 'lodash/compact'
import { postalCodes } from '@/features/Validation/helpers'
import { sizeString as gSizeString } from '@/shared/interfaces/commons'

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
      date: Type.String({ date: true }),
    }),
  },
  {
    name: 'after',
    options: Type.Object({
      date: Type.String({ date: true }),
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
    field: Type.String({ field: true }),
  }),

  state: Type.Object({
    disable: Type.Boolean(),
    readonly: Type.Boolean(),
  }),

  style: Type.Object({
    dense: Type.Boolean(),
    border: Type.Object({
      style: Type.String(),
      color: Type.String({ color: true }),
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

import {
  StringEnum, TObject, TSchema, Type,
} from '@feathersjs/typebox'
import compact from 'lodash/compact'
import { postalCodes } from '@/features/Validation/helpers'

export const sizeString = Type.String({
  options: [
    { value: 'xs', icon: 'mdi-size-xs' },
    { value: 'sm', icon: 'mdi-size-s' },
    { value: 'md', icon: 'mdi-size-m' },
    { value: 'lg', icon: 'mdi-size-l' },
    { value: 'xl', icon: 'mdi-size-xl' },
  ],
  toggles: true,
  clearable: true,
})

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
  field: Type.Object({
    field: Type.String({ field: true }),
  }),

  state: Type.Object({
    disable: Type.Boolean(),
    readonly: Type.Boolean(),
  }),

  style: Type.Object({
    dense: Type.Boolean(),
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
    size: sizeString,
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

export const properties = (props: TObject[], field = true) => Type.Intersect(
  compact([
    ...props,
    field ? commonProperties.field : undefined,
  ]),
)

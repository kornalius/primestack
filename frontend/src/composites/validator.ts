import {
  numeric, alpha, sin, uuid, email, birthday,
} from './parser'

type T18N = (path: string, args?) => string

type ValidationFunction = (val: string) => true | string

/**
 * Validation rule for required field
 */
export const isRequired = (t: T18N) => (str: string): true | string => (
  (str !== '' && !!str) || t('field_errors.required')
)

/**
 * Validation rule for numeric only field
 */
export const isNumericOnly = (t: T18N) => (str: string): true | string => (
  !!numeric(str) || t('field_errors.numericOnly')
)

/**
 * Validation rule for alpha only field
 */
export const isAlphaOnly = (t: T18N) => (str: string): true | string => (
  !!alpha(str) || t('field_errors.alphaOnly')
)

/**
 * Validation rule for SIN field
 */
export const isSIN = (t: T18N) => (str: string): true | string => (
  !!sin(str) || t('field_errors.sin')
)

/**
 * Validation rule for UUID field
 */
export const isUUID = (t: T18N) => (str: string): true | string => (
  !!uuid(str) || t('field_errors.uuid')
)

/**
 * Validation rule for email field
 */
export const isEmail = (t: T18N) => (str: string): true | string => (
  !!email(str) || t('field_errors.email')
)

/**
 * Validation rule for birthday field
 */
export const isBirthday = (t: T18N) => (str: string): true | string => (
  !!birthday(str) || t('field_errors.birthday')
)

/**
 * Validation rule for maximum length of field
 */
export const isMaxLength = (t: T18N, maxLen: number) => (str: string): true | string => (
  (str || '').length <= maxLen || t('field_errors.maxLength', { maxLen })
)

/**
 * Validation rule for minimum length of field
 */
export const isMinLength = (t: T18N, minLen: number) => (str: string): true | string => (
  (str || '').length >= minLen || t('field_errors.minLength', { minLen })
)

export const useValidator = (t: T18N): {
  required: ValidationFunction
  numericOnly: ValidationFunction
  alphaOnly: ValidationFunction
  isSin: ValidationFunction
  uuid: ValidationFunction
  email: ValidationFunction
  birthday: ValidationFunction
  maxLength: (t: T18N, maxLen: number) => ValidationFunction
  minLength: (t: T18N, minLen: number) => ValidationFunction
} => ({
  required: isRequired(t),
  numericOnly: isNumericOnly(t),
  alphaOnly: isAlphaOnly(t),
  isSin: isSIN(t),
  uuid: isUUID(t),
  email: isEmail(t),
  birthday: isBirthday(t),
  maxLength: isMaxLength,
  minLength: isMinLength,
})

export default {}

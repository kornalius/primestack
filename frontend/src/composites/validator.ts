import {
  numeric, alpha, email, phone,
} from './parser'

type T18N = (path: string, args?) => string

/**
 * Validation rule for required field
 */
export const isRequired = (t: T18N) => (str: string): true | string => (
  (str !== '' && !!str) || t('field_errors.required')
)

/**
 * Validation rule for numeric only field
 */
export const isNumeric = (t: T18N) => (str: string): true | string => (
  !!numeric(str) || t('field_errors.numeric')
)

/**
 * Validation rule for alpha only field
 */
export const isAlpha = (t: T18N) => (str: string): true | string => (
  !!alpha(str) || t('field_errors.alpha')
)

/**
 * Validation rule for email field
 */
export const isEmail = (t: T18N) => (str: string): true | string => (
  !!email(str) || t('field_errors.email')
)

/**
 * Validation rule for phone field
 */
export const isPhone = (t: T18N) => (str: string): true | string => (
  !!phone(str) || t('field_errors.phone')
)

/**
 * Validation rule for maximum length of field
 */
export const isMax = (t: T18N) => (count: number) => (str: string): true | string => (
  (str || '').length <= count || t('field_errors.max', { count })
)

/**
 * Validation rule for minimum length of field
 */
export const isMin = (t: T18N) => (count: number) => (str: string): true | string => (
  (str || '').length >= count || t('field_errors.min', { count })
)

export const useValidator = (t: T18N) => ({
  isRequired: isRequired(t),
  isNumeric: isNumeric(t),
  isAlpha: isAlpha(t),
  isEmail: isEmail(t),
  isPhone: isPhone(t),
  isMax: isMax(t),
  isMin: isMin(t),
})

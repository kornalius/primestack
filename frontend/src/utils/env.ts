import { AnyData } from '@/shared/interfaces/commons'

export const getEnv = (
  value?: AnyData | string | number | boolean | null,
  defaultValue?: string,
): AnyData | string | number | boolean => {
  const r = value || defaultValue

  if (
    (r !== undefined && r !== null)
    && typeof r === 'string'
    && (
      /^(true|false)$/.test(r)
      || /^\[.*]$/.test(r)
      || /^{.*}$/.test(r)
      || /^[-+]?[0-9]*\.?[0-9]+$/.test(r)
    )
  ) {
    return JSON.parse(r)
  }

  return r
}

export default {}

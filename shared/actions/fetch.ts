import { StringEnum, Type } from '@feathersjs/typebox'
import { TAction } from '../interfaces/actions'
import ExType from '../extypes'

export default {
  type: 'fetch',
  label: 'Fetch ',
  schema: Type.Object({
    href: Type.String(),
    method: StringEnum(['GET', 'POST', 'PATCH', 'HEAD', 'OPTIONS']),
    credentials: StringEnum(['omit', 'same-origin', 'include']),
    cache: StringEnum([
      'default',
      'no-store',
      'reload',
      'no-cache',
      'force-cache',
      'only-if-cached',
    ]),
    redirect: StringEnum(['follow', 'error', 'manual']),
    headers: Type.Array(Type.Object({
      key: Type.String(),
      value: Type.String(),
    }, { horizontal: true })),
    body: ExType.JSON(),
    referer: Type.String(),
    refererPolicy: StringEnum([
      'no-referrer',
      'no-referrer-when-downgrade',
      'same-origin',
      'origin',
      'strict-origin',
      'origin-when-cross-origin',
      'strict-origin-when-cross-origin',
      'unsafe-url',
    ]),
    mode: StringEnum(['cors', 'navigate', 'no-cors', 'same-origin']),
    priority: StringEnum(['high', 'low', 'auto']),
    target: Type.String({ variable: true }),
  }),
  defaultValues: {
    method: 'GET',
    credentials: 'omit',
    redirect: 'follow',
    cache: 'no-cache',
    priority: 'auto',
  },
} as TAction

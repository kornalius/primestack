import { Type } from '@feathersjs/typebox'

type Id = string
type NullableString = string | null
type Timestamp = NullableString

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyData = Record<string, any>

export interface FeathersTempRecordInterface {
  '__id'?: Id;
  '__isTemp'?: boolean;
}

export interface BaseInterface extends FeathersTempRecordInterface {
  _id?: Id;
  'created_at': Timestamp;
  'created_by': string;
  'updated_at': Timestamp;
  'updated_by': string;
  'deleted_at': Timestamp;
  'deleted_by': NullableString;
}

export type T18N = (path: string, ...args: unknown[]) => string

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

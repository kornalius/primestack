import compact from 'lodash/compact'
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

export const hAlignString = Type.String({
  options: [
    { value: 'start', icon: 'mdi-align-horizontal-left' },
    { value: 'center', icon: 'mdi-align-horizontal-center' },
    { value: 'end', icon: 'mdi-align-horizontal-right' },
  ],
  toggles: true,
  clearable: true,
})

export const vAlignString = Type.String({
  options: [
    { value: 'start', icon: 'mdi-align-vertical-top' },
    { value: 'center', icon: 'mdi-align-vertical-center' },
    { value: 'end', icon: 'mdi-align-vertical-bottom' },
  ],
  toggles: true,
  clearable: true,
})

export const flexSizeString = (auto = true) => Type.String({
  options: compact([
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
    auto ? { label: 'A', value: 'auto' } : undefined,
  ]),
  toggles: true,
  clearable: true,
})

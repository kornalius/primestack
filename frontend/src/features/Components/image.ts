import { QImg } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, sizeString, defaultStyleValues, commonEventArgs,
} from './common'

export default {
  type: 'image',
  icon: 'mdi-image',
  label: 'components.image.label',
  component: QImg,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.String(),
      srcset: Type.String(),
      alt: Type.String(),
      sizes: Type.String(),
      placeholderSrc: Type.String(),
      loading: StringEnum(['eager', 'lazy']),
      crossorigin: StringEnum(['anonymous', 'use-credentials']),
      decoding: StringEnum(['sync', 'async', 'auto']),
      reffererpolicy: StringEnum([
        'no-referrer',
        'no-referrer-when-downgrade',
        'origin',
        'origin-when-cross-origins',
        'name-origin',
        'strict-origin',
        'strict-origin-when-cross-origin',
        'unsafe-url',
      ]),
      fetchpriority: StringEnum(['high', 'low', 'auto']),
      draggable: Type.Boolean(),
      noSpinner: Type.Boolean(),
      noNativeMenu: Type.Boolean(),
      noTransition: Type.Boolean(),
      ratio: Type.String(),
      position: Type.String(),
      width: Type.String(),
      height: Type.String(),
      fit: StringEnum([
        'cover',
        'fill',
        'contain',
        'none',
        'scale-down',
      ]),
      spinnerColor: ExType.Color(),
      spinnerSize: sizeString,
      load: ExType.Action(),
      error: ExType.Action(),
    }),
  ]),
  defaultValues: {
    loading: 'eager',
    decoding: 'async',
    fetchpriority: 'auto',
    referrerpolicy: 'strict-origin-when-cross-origin',
    fit: 'cover',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'srcset',
        'alt',
        'placeholderSrc',
        'loading',
        'crossorigin',
        'decoding',
        'reffererpolicy',
        'fetchpriority',
        'draggable',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'width',
        'height',
        'fit',
        'position',
        'ratio',
        'sizes',
        'noSpinner',
        'noNativeMenu',
        'noTransition',
        'spinnerColor',
        'spinnerSize',
        'border',
        'padding',
        'margin',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'load',
        'error',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    load: (src) => ({ src }),
    error: (error) => ({ error }),
  },
} as TFormComponent

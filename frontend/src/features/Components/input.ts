import { QInput } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'input',
  icon: 'mdi-form-textbox',
  label: 'Input',
  component: QInput,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.Union([Type.String(), Type.Null(), Type.Undefined()]),
      mask: Type.String(),
      fillMask: Type.String(),
      unmaskedValue: Type.Boolean(),
      label: Type.String(),
      labelColor: Type.String({ color: true }),
      stackLabel: Type.Boolean(),
      hint: Type.String(),
      hideHint: Type.Boolean(),
      prefix: Type.String(),
      suffix: Type.String(),
      clearable: Type.Boolean(),
      loading: Type.Boolean(),
      counter: Type.Boolean(),
      autogrow: Type.Boolean(),
      filled: Type.Boolean(),
      outlined: Type.Boolean(),
      square: Type.Boolean(),
      borderless: Type.Boolean(),
      standout: Type.Boolean(),
      rounded: Type.Boolean(),
      itemAligned: Type.Boolean(),
      type: StringEnum([
        'text',
        'password',
        'area',
        'email',
        'search',
        'file',
        'number',
        'url',
        'time',
        'date',
      ]),
      maxLength: Type.Number(),
      color: Type.String({ color: true }),
      bgColor: Type.String({ color: true }),
      hideBottomSpace: Type.Boolean(),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    type: 'text',
    dense: true,
    outlined: true,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'disable',
        'readonly',
        'label',
        'hint',
        'prefix',
        'suffix',
        'loading',
        'counter',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'type',
        'modelValue',
        'clearable',
        'mask',
        'fillMask',
        'unmaskedValue',
        'maxLength',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'color',
        'bgColor',
        'labelColor',
        'stackLabel',
        'hideBottomSpace',
        'itemAligned',
        'hideHint',
        'autogrow',
        'filled',
        'outlined',
        'square',
        'borderless',
        'standout',
        'rounded',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent
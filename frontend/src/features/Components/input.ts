import { QInput } from 'quasar'
import { Static, StringEnum, Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import { fieldSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs,
} from './common'

type FormField = Static<typeof fieldSchema>

export default {
  type: 'input',
  icon: 'mdi-form-textbox',
  label: 'Input',
  component: QInput,
  numericInput: (field: FormField): boolean => (field as AnyData).type === 'number',
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.rules,
    commonProperties.events,
    Type.Object({
      modelValue: Type.Union([Type.String(), Type.Null(), Type.Undefined()]),
      mask: Type.String(),
      fillMask: Type.String(),
      unmaskedValue: Type.Boolean(),
      label: Type.String(),
      labelColor: ExType.Color(),
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
      color: ExType.Color(),
      bgColor: ExType.Color(),
      hideBottomSpace: Type.Boolean(),
      backgroundColor: ExType.Color(),
      clear: ExType.Action(),
    }),
  ]),
  defaultValues: {
    type: 'text',
    dense: true,
    outlined: true,
    rules: [],
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
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
        'name',
        'modelValue',
        'field',
        'type',
        'rules',
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
        'backgroundColor',
        'border',
        'padding',
        'margin',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'clear',
        'focus',
        'blur',
        'keydown',
        'keypress',
        'keyup',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    clear: () => ({}),
  },
} as TFormComponent

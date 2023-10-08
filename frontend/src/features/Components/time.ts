import { QTime } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'time',
  icon: 'mdi-clock-outline',
  label: 'components.time.label',
  component: QTime,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.String(),
      landscape: Type.Boolean(),
      outlined: Type.Boolean(),
      withSeconds: Type.Boolean(),
      nowBtn: Type.Boolean(),
      mask: Type.String(),
      calendar: StringEnum(['gregorian', 'persian']),
      color: ExType.Color({ quasarPalette: true }),
      textColor: ExType.Color({ quasarPalette: true }),
      square: Type.Boolean(),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
      hideBottomSpace: Type.Boolean(),
      backgroundColor: ExType.Color(),
    }),
  ]),
  defaultValues: {
    dense: true,
    outlined: true,
    calendar: 'gregorian',
    hideBottomSpace: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'mask',
        'disable',
        'readonly',
        'calendar',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'nowBtn',
        'withSeconds',
        'landscape',
        'outlined',
        'minimal',
        'color',
        'textColor',
        'square',
        'flat',
        'bordered',
        'hideBottomSpace',
        'backgroundColor',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
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
  },
} as TFormComponent

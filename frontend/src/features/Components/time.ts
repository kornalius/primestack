import { QTime } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'time',
  icon: 'mdi-clock-outline',
  label: 'Time',
  component: QTime,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.String(),
      landscape: Type.Boolean(),
      outlined: Type.Boolean(),
      withSeconds: Type.Boolean(),
      nowBtn: Type.Boolean(),
      mask: Type.String(),
      calendar: StringEnum(['gregorian', 'persian']),
      color: Type.String({ color: true }),
      textColor: Type.String({ color: true }),
      square: Type.Boolean(),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
      hideBottomSpace: Type.Boolean(),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    dense: true,
    outlined: true,
    calendar: 'gregorian',
    hideBottomSpace: true,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

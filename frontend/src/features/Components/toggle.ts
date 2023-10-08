import { QToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'toggle',
  icon: 'mdi-toggle-switch-off-outline',
  label: 'components.toggle.label',
  component: QToggle,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.Boolean(),
      label: Type.String(),
      leftLabel: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      iconColor: ExType.Color({ quasarPalette: true }),
      keepColor: Type.Boolean(),
    }),
  ]),
  defaultValues: {
    modelValue: false,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'disable',
        'readonly',
        'label',
        'leftLabel',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'color',
        'iconColor',
        'keepColor',
        'size',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
  },
} as TFormComponent

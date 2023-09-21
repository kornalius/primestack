import { QToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'toggle',
  icon: 'mdi-toggle-switch-off-outline',
  label: 'Toggle',
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
      color: Type.String({ color: true }),
      iconColor: Type.String({ color: true }),
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
        'border',
        'padding',
        'margin',
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
} as TFormComponent

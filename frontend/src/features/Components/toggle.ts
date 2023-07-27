import { QToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'toggle',
  icon: 'mdi-toggle-switch-off-outline',
  label: 'Toggle',
  component: QToggle,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    Type.Object({
      modelValue: Type.Boolean(),
      label: Type.String(),
      leftLabel: Type.Boolean(),
      color: Type.String({ color: true }),
      iconColor: Type.String({ color: true }),
      keepColor: Type.Boolean(),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    modelValue: false,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

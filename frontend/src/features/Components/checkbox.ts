import { QCheckbox } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs,
} from './common'

export default {
  type: 'checkbox',
  icon: 'mdi-check',
  label: 'components.checkbox.label',
  component: QCheckbox,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.Boolean(),
      label: Type.String(),
      leftLabel: Type.Boolean(),
      color: ExType.Color(),
      keepColor: Type.Boolean(),
      checkedIcon: ExType.Icon(),
      uncheckedIcon: ExType.Icon(),
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
        'checkedIcon',
        'uncheckedIcon',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'color',
        'keepColor',
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
  eventArgs: {
    ...commonEventArgs,
  },
} as TFormComponent

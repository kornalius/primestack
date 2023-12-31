import { QCheckbox } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
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
      checked: Type.Boolean(),
      label: Type.String(),
      leftLabel: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      keepColor: Type.Boolean(),
      checkedIcon: ExType.Icon(),
      uncheckedIcon: ExType.Icon(),
      toggleIndeterminate: Type.Boolean(),
    }),
  ]),
  modelValueField: 'checked',
  defaultValues: {
    checked: false,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'checked',
        'field',
        'disable',
        'readonly',
        { label: 'Indeterminate', value: 'toggleIndeterminate' },
        'label',
        'checkedIcon',
        'uncheckedIcon',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'leftLabel',
        'color',
        'keepColor',
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

import { QCheckbox } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'checkbox',
  icon: 'mdi-check',
  label: 'Checkbox',
  component: QCheckbox,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.Boolean(),
      label: Type.String(),
      leftLabel: Type.Boolean(),
      color: Type.String({ color: true }),
      keepColor: Type.Boolean(),
      checkedIcon: Type.String({ icon: true }),
      uncheckedIcon: Type.String({ icon: true }),
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

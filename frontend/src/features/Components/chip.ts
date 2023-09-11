import { QChip } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'chip',
  icon: 'mdi-square-rounded',
  label: 'Chip',
  component: QChip,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.style,
    Type.Object({
      modelValue: Type.Boolean(),
      selected: Type.Boolean(),
      label: Type.String(),
      icon: Type.String({ icon: true }),
      color: Type.String({ color: true }),
      textColor: Type.String({ color: true }),
      clickable: Type.Boolean(),
      removable: Type.Boolean(),
      square: Type.Boolean(),
      outline: Type.Boolean(),
    }),
  ]),
  defaultValues: {
    modelValue: true,
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
        'icon',
        'selected',
        'clickable',
        'removable',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'size',
        'color',
        'textColor',
        'square',
        'outline',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

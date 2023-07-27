import { QOptionGroup } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'option-group',
  icon: 'mdi-radiobox-marked',
  label: 'Option Group',
  component: QOptionGroup,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.String(),
      color: Type.String({ color: true }),
      keepColor: Type.Boolean(),
      type: StringEnum(['radio', 'checkbox', 'toggle']),
      leftLabel: Type.Boolean(),
      inline: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
        disable: Type.Boolean(),
      }, { horizontalPopup: true })),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    type: 'radio',
  },
  editStyles: {
    minHeight: '40px',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'type',
        'modelValue',
        'options',
        'disable',
        'readonly',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'color',
        'keepColor',
        'leftLabel',
        'inline',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

import { QOptionGroup } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'option-group',
  icon: 'mdi-radiobox-marked',
  label: 'components.option-group.label',
  component: QOptionGroup,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      color: ExType.Color({ quasarPalette: true }),
      keepColor: Type.Boolean(),
      type: StringEnum(['radio', 'checkbox', 'toggle']),
      leftLabel: Type.Boolean(),
      inline: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
        disable: Type.Boolean(),
      }, { horizontal: true, horizontalPopup: true })),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    type: 'radio',
    ...defaultStyleValues,
  },
  editStyles: {
    minHeight: '40px',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'value',
        'field',
        'type',
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

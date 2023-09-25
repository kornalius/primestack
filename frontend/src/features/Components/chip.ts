import { QChip } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, clickEvent,
} from './common'

export default {
  type: 'chip',
  icon: 'mdi-square-rounded',
  label: 'Chip',
  component: QChip,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.Boolean(),
      selected: Type.Boolean(),
      label: Type.String(),
      icon: ExType.Icon(),
      color: ExType.Color(),
      textColor: ExType.Color(),
      clickable: Type.Boolean(),
      removable: Type.Boolean(),
      square: Type.Boolean(),
      outline: Type.Boolean(),
      remove: ExType.Action(),
      click: ExType.Action(),
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
    action: {
      icon: actionIcon,
      names: [
        'click',
        'remove',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    remove: () => ({}),
    click: clickEvent,
  },
} as TFormComponent

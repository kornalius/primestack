import { QChip } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, clickEvent, styleNames,
} from './common'

export default {
  type: 'chip',
  icon: 'mdi-square-rounded',
  label: 'components.chip.label',
  component: QChip,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      visible: Type.Boolean(),
      selected: Type.Boolean(),
      label: Type.String(),
      icon: ExType.Icon(),
      color: ExType.Color({ quasarPalette: true }),
      textColor: ExType.Color({ quasarPalette: true }),
      clickable: Type.Boolean(),
      removable: Type.Boolean(),
      square: Type.Boolean(),
      outline: Type.Boolean(),
      remove: ExType.Action(),
      click: ExType.Action(),
    }),
  ]),
  modelValueField: 'visible',
  defaultValues: {
    visible: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'visible',
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
        ...styleNames,
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

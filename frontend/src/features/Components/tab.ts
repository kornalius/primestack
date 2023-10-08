import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon, actionIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, commonEventArgs, clickEvent, focusEvent,
} from './common'

export default {
  type: 'tab',
  icon: 'mdi-tab',
  label: 'components.tab.label',
  nokey: true,
  hidden: true,
  schema: properties([
    commonProperties.state,
    commonProperties.events,
    Type.Object({
      name: Type.String(),
      label: Type.String(),
      icon: Type.String(),
      alert: Type.String(),
      color: ExType.Color({ quasarPalette: true }),
      alertColor: ExType.Color({ quasarPalette: true }),
      alertIcon: ExType.Icon(),
      noCaps: Type.Boolean(),
      badgeValue: Type.String(),
      badgeColor: ExType.Color({ quasarPalette: true }),
      click: ExType.Action(),
      focus: ExType.Action(),
      blur: ExType.Action(),
    }),
  ]),
  defaultValues: {
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'disable',
        'label',
        'icon',
        'alert',
        'badgeValue',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'noCaps',
        'color',
        'badgeColor',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'click',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    click: clickEvent,
    focus: focusEvent,
    blur: focusEvent,
  },
} as TFormComponent

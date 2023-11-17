import { QBtn } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon, actionIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, clickEvent, styleNames,
} from './common'

export default {
  type: 'button',
  icon: 'mdi-button-pointer',
  label: 'components.button.label',
  component: QBtn,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      label: Type.String(),
      color: ExType.Color({ quasarPalette: true }),
      textColor: ExType.Color({ quasarPalette: true }),
      to: Type.String(),
      target: Type.String(),
      replace: Type.Boolean(),
      loading: Type.Boolean(),
      noCaps: Type.Boolean(),
      noWrap: Type.Boolean(),
      align: StringEnum([
        'left',
        'right',
        'center',
        'around',
        'between',
        'spaced',
      ]),
      icon: Type.String({ icon: true }),
      stack: Type.Boolean(),
      stretch: Type.Boolean(),
      round: Type.Boolean(),
      rounded: Type.Boolean(),
      glossy: Type.Boolean(),
      outline: Type.Boolean(),
      flat: Type.Boolean(),
      push: Type.Boolean(),
      square: Type.Boolean(),
      unelevated: Type.Boolean(),
      fab: Type.Boolean(),
      fabMini: Type.Boolean(),
      click: ExType.Action(),
    }),
  ], false),
  defaultValues: {
    align: 'center',
    flat: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'label',
        'icon',
        'loading',
        {
          label: 'Native link',
          children: [
            'to',
            'target',
            'replace',
          ],
        },
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'size',
        'align',
        'color',
        'textColor',
        'stack',
        'stretch',
        'round',
        'rounded',
        'glossy',
        'outline',
        'flat',
        'push',
        'square',
        'unelevated',
        'fab',
        'fabMini',
        'noCaps',
        'noWrap',
        ...styleNames,
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
  },
} as TFormComponent

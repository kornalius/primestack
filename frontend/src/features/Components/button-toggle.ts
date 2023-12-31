import { QBtnToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'button-toggle',
  icon: 'mdi-checkbox-multiple-blank',
  label: 'components.button-toggle.label',
  component: QBtnToggle,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      spread: Type.Boolean(),
      noCaps: Type.Boolean(),
      noWrap: Type.Boolean(),
      stack: Type.Boolean(),
      stretch: Type.Boolean(),
      clearable: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
        icon: ExType.Icon(),
      }, { horizontal: true, horizontalPopup: true })),
      clear: ExType.Action(),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'value',
        'field',
        'clearable',
        'options',
        'disable',
        'readonly',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'spread',
        'stack',
        'stretch',
        'noCaps',
        'noWrap',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'clear',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    clear: () => ({}),
  },
} as TFormComponent

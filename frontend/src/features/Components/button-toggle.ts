import { QBtnToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'button-toggle',
  icon: 'mdi-checkbox-multiple-blank',
  label: 'Buttons',
  component: QBtnToggle,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.String(),
      spread: Type.Boolean(),
      noCaps: Type.Boolean(),
      noWrap: Type.Boolean(),
      stack: Type.Boolean(),
      stretch: Type.Boolean(),
      clearable: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
        icon: Type.String({ icon: true }),
      }, { horizontalPopup: true })),
      clear: Type.String({ objectid: true, action: true }),
    }),
  ]),
  defaultValues: {
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'clearable',
        'options',
        'disable',
        'readonly',
        'noCaps',
        'noWrap',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'spread',
        'stack',
        'stretch',
        'border',
        'padding',
        'margin',
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
} as TFormComponent

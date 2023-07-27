import { QBtnToggle } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'button-toggle',
  icon: 'mdi-checkbox-multiple-blank',
  label: 'Buttons',
  component: QBtnToggle,
  schema: properties([
    commonProperties.state,
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
    }),
    commonProperties.style,
  ]),
  defaultValues: {
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

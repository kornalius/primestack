import { StringEnum, Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ColorField from '@/features/Fields/components/ColorField.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'color',
  icon: 'mdi-eyedropper-variant',
  label: 'components.color.label',
  component: ColorField,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      defaultValue: Type.String(),
      formatModel: StringEnum(['auto', 'hex', 'rgb', 'hexa', 'rgba']),
      defaultView: StringEnum(['spectrum', 'tune', 'palette']),
      noHeader: Type.Boolean(),
      noHeaderTabs: Type.Boolean(),
      noFooter: Type.Boolean(),
      square: Type.Boolean(),
      flat: Type.Boolean(),
      bordered: Type.Boolean(),
      hideBottomSpace: Type.Boolean(),
      clear: ExType.Action(),
      input: ExType.Action(),
      remove: ExType.Action(),
      add: ExType.Action(),
      popupShow: ExType.Action(),
      popupHide: ExType.Action(),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    dense: true,
    outlined: true,
    defaultView: 'palette',
    formatModel: 'auto',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'value',
        'field',
        'defaultValue',
        'formatModel',
        'disable',
        'readonly',
        'defaultView',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'noHeader',
        'noHeaderTabs',
        'noFooter',
        'square',
        'flat',
        'bordered',
        'hideBottomSpace',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'clear',
        'input',
        'remove',
        'add',
        'popupShow',
        'popupHide',
        'focus',
        'blur',
        'keydown',
        'keyup',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    clear: () => ({}),
    input: (value: string) => ({ value }),
    remove: ({ index, value }) => ({ index, value }),
    add: ({ index, value }) => ({ index, value }),
    popupShow: () => ({}),
    popupHide: () => ({}),
  },
} as TFormComponent

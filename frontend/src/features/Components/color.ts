import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ColorField from '@/features/Fields/components/ColorField.vue'
import { properties, commonProperties } from './common'

export default {
  type: 'color',
  icon: 'mdi-eyedropper-variant',
  label: 'Color',
  component: ColorField,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.String(),
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
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    dense: true,
    outlined: true,
    defaultView: 'palette',
    formatModel: 'auto',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'defaultValue',
        'formatModel',
        'disable',
        'readonly',
        'defaultView',
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

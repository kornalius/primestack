import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import LabelField from '@/features/Fields/components/LabelField.vue'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'label',
  icon: 'mdi-format-color-text',
  label: 'Label',
  component: LabelField,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.String(),
      format: Type.String({
        options: [
          { value: 'overline', icon: 'mdi-format-overline' },
          { value: 'title', icon: 'mdi-format-title' },
          { value: 'subtitle', icon: 'mdi-subtitles' },
          { value: 'caption', icon: 'mdi-closed-caption' },
        ],
        toggles: true,
        clearable: true,
      }),
      heading: Type.String({
        options: [
          { value: 'h1', icon: 'mdi-format-header-1' },
          { value: 'h2', icon: 'mdi-format-header-2' },
          { value: 'h3', icon: 'mdi-format-header-3' },
          { value: 'h4', icon: 'mdi-format-header-4' },
          { value: 'h5', icon: 'mdi-format-header-5' },
          { value: 'h6', icon: 'mdi-format-header-6' },
        ],
        toggles: true,
        clearable: true,
      }),
      styling: Type.String({
        options: [
          { value: 'bold', icon: 'mdi-format-bold' },
          { value: 'italic', icon: 'mdi-format-italic' },
          { value: 'strike', icon: 'mdi-format-strikethrough' },
        ],
        toggles: true,
        clearable: true,
      }),
      casing: Type.String({
        options: [
          { value: 'uppercase', icon: 'mdi-format-letter-case-upper' },
          { value: 'lowercase', icon: 'mdi-format-letter-case-lower' },
          { value: 'capitalize', icon: 'mdi-format-letter-case' },
        ],
        toggles: true,
        clearable: true,
      }),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ]),
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'modelValue',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'format',
        'heading',
        'styling',
        'casing',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

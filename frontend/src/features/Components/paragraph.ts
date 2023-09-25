import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import Editor from '@/features/Fields/components/Editor.vue'
import ExType from '@/shared/extypes'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'paragraph',
  icon: 'mdi-text-box-edit-outline',
  label: 'Paragraph',
  component: Editor,
  interactable: true,
  schema: properties([
    commonProperties.state,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.String(),
      placeholder: Type.String(),
      noRouteFullscreenExit: Type.Boolean(),
      square: Type.Boolean(),
      flat: Type.Boolean(),
      dense: Type.Boolean(),
      toolbarOutline: Type.Boolean(),
      toolbarPush: Type.Boolean(),
      toolbarRounded: Type.Boolean(),
      minHeight: Type.String(),
      maxHeight: Type.String(),
      definitions: Type.Array(Type.Object({
        commandName: Type.String(),
        label: Type.String(),
        tip: Type.String(),
        icon: Type.String({ icon: true }),
        key: Type.Number(),
      })),
      toolbar: Type.Array(Type.Array(Type.String())),
      toolbarColor: ExType.Color(),
      toolbarTextColor: ExType.Color(),
      toolbarToggleColor: ExType.Color(),
      toolbarBg: ExType.Color(),
      backgroundColor: ExType.Color(),
    }),
  ]),
  defaultValues: {
    paragraphTag: 'div',
    modelValue: '',
    toolbar: [
      ['left', 'center', 'right', 'justify'],
      ['bold', 'italic', 'underline', 'strike'],
      ['undo', 'redo'],
    ],
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'noRouteFullscreenExit',
        'placeholder',
        'minHeight',
        'maxHeight',
      ],
    },
    toolbar: {
      icon: 'mdi-gesture-tap-button',
      names: [
        'definitions',
        'toolbar',
        'toolbarOutline',
        'toolbarPush',
        'toolbarRounded',
        'toolbarColor',
        'toolbarTextColor',
        'toolbarToggleColor',
        'toolbarBg',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'square',
        'flat',
        'backgroundColor',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

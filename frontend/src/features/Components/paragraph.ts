import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import Editor from '@/features/Fields/components/Editor.vue'
import { properties, commonProperties } from './common'

export default {
  type: 'paragraph',
  icon: 'mdi-text-box-edit-outline',
  label: 'Paragraph',
  component: Editor,
  interactable: true,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
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
      toolbarColor: Type.String({ color: true }),
      toolbarTextColor: Type.String({ color: true }),
      toolbarToggleColor: Type.String({ color: true }),
      toolbarBg: Type.String({ color: true }),
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
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'modelValue',
        'field',
        'noRouteFullscreenExit',
        'placeholder',
        'minHeight',
        'maxHeight',
        'disable',
        'readonly',
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
        'dense',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

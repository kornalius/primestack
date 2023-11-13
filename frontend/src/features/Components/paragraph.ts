import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'paragraph',
  icon: 'mdi-text-box-edit-outline',
  label: 'components.paragraph.label',
  interactable: true,
  schema: properties([
    commonProperties.state,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      text: Type.String(),
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
      toolbarColor: ExType.Color({ quasarPalette: true }),
      toolbarTextColor: ExType.Color({ quasarPalette: true }),
      toolbarToggleColor: ExType.Color({ quasarPalette: true }),
      toolbarBg: ExType.Color({ quasarPalette: true }),
      backgroundColor: ExType.Color(),
    }),
  ]),
  modelValueField: 'text',
  defaultValues: {
    paragraphTag: 'div',
    text: '',
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
        'text',
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
        {
          label: 'Toolbar',
          sectionColor: 'orange-1',
          children: [
            { name: 'toolbar', label: 'Buttons' },
            { name: 'toolbarOutline', label: 'Outline' },
            { name: 'toolbarPush', label: 'Push' },
            { name: 'toolbarRounded', label: 'Rounded' },
            { name: 'toolbarColor', label: 'Color' },
            { name: 'toolbarTextColor', label: 'Text Color' },
            { name: 'toolbarToggleColor', label: 'Toggle Color' },
            { name: 'toolbarBg', label: 'Background Color' },
          ],
        },
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'square',
        'flat',
        'backgroundColor',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import IconField from '@/features/Fields/components/IconField.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'icon-select',
  icon: 'mdi-form-select',
  label: 'components.icon-select.label',
  component: IconField,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      virtualScrollHorizontal: Type.Boolean(),
      loading: Type.Boolean(),
      clearable: Type.Boolean(),
      tableColspan: Type.Number(),
      noErrorIcon: Type.Boolean(),
      label: Type.String(),
      labelColor: ExType.Color({ quasarPalette: true }),
      color: ExType.Color({ quasarPalette: true }),
      bgColor: ExType.Color({ quasarPalette: true }),
      stackLabel: Type.Boolean(),
      hint: Type.String(),
      hideHint: Type.Boolean(),
      prefix: Type.String(),
      suffix: Type.String(),
      multiple: Type.Boolean(),
      hideSelected: Type.Boolean(),
      maxValues: Type.Number(),
      useChips: Type.Boolean(),
      useInput: Type.Boolean(),
      filled: Type.Boolean(),
      outlined: Type.Boolean(),
      square: Type.Boolean(),
      borderless: Type.Boolean(),
      standout: Type.Boolean(),
      rounded: Type.Boolean(),
      itemAligned: Type.Boolean(),
      hideBottomSpace: Type.Boolean(),
      backgroundColor: ExType.Color(),
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
    emitValue: true,
    useInput: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'label',
        'hint',
        'prefix',
        'suffix',
        'tableColspan',
        'loading',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'value',
        'field',
        'clearable',
        'multiple',
        'emitValue',
        'displayValue',
        'maxValues',
        'useInput',
        {
          label: 'Options',
          sectionColor: 'orange-1',
          children: [
            'options',
            'optionLabel',
            'optionValue',
            'optionDisable',
          ],
        },
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        {
          label: 'Colors',
          sectionColor: 'red-1',
          children: [
            'labelColor',
            'color',
            { name: 'bgColor', label: 'Background Color' },
          ],
        },
        'stackLabel',
        'hideHint',
        'noErrorIcon',
        'hideSelected',
        'useChips',
        'filled',
        'outlined',
        'square',
        'borderless',
        'standout',
        'rounded',
        'itemAligned',
        'hideBottomSpace',
        'virtualScrollHorizontal',
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

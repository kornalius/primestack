import { QSelect } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'select',
  icon: 'mdi-form-select',
  label: 'Select',
  component: QSelect,
  schema: properties([
    commonProperties.state,
    Type.Object({
      modelValue: Type.String(),
      virtualScrollHorizontal: Type.Boolean(),
      loading: Type.Boolean(),
      clearable: Type.Boolean(),
      tableColspan: Type.Number(),
      noErrorIcon: Type.Boolean(),
      label: Type.String(),
      labelColor: Type.String({ color: true }),
      color: Type.String({ color: true }),
      bgColor: Type.String({ color: true }),
      stackLabel: Type.Boolean(),
      hint: Type.String(),
      hideHint: Type.Boolean(),
      prefix: Type.String(),
      suffix: Type.String(),
      multiple: Type.Boolean(),
      emitValue: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
      }, { horizontalPopup: true })),
      optionLabel: Type.String(),
      optionValue: Type.String(),
      optionDisable: Type.String(),
      optionsDense: Type.Boolean(),
      displayValue: Type.String(),
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
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    dense: true,
    outlined: true,
    emitValue: true,
    optionLabel: 'label',
    optionValue: 'value',
    optionDisable: 'disable',
    optionsDense: true,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'disable',
        'readonly',
        'label',
        'prefix',
        'suffix',
        'hint',
        'tableColspan',
        'loading',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'modelValue',
        'options',
        'optionLabel',
        'optionValue',
        'optionDisable',
        'multiple',
        'emitValue',
        'displayValue',
        'maxValues',
        'clearable',
        'useInput',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'labelColor',
        'color',
        'bgColor',
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

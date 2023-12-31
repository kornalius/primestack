import { QSelect } from 'quasar'
import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import ServiceSelect from '@/features/Fields/components/ServiceSelect.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'select',
  icon: 'mdi-form-select',
  label: 'components.select.label',
  component: (data: AnyData) => (
    data.tableId ? ServiceSelect : QSelect
  ),
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      tableId: ExType.Table(),
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
      emitValue: Type.Boolean(),
      options: Type.Array(Type.Object({
        label: Type.String(),
        value: Type.String(),
        disable: Type.Boolean(),
      }, { horizontal: true, horizontalPopup: true })),
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
    optionLabel: 'label',
    optionValue: 'value',
    optionDisable: 'disable',
    optionsDense: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'label',
        'prefix',
        'suffix',
        'hint',
        'tableColspan',
        'loading',
        'renderWhen',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'value',
        'field',
        { name: 'tableId', label: 'Table' },
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
        'optionsDense',
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

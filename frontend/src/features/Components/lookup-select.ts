import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import LookupSelect from '@/features/Tables/components/LookupSelect.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs,
} from './common'

export default {
  type: 'lookup-select',
  icon: 'mdi-database-search',
  label: 'components.lookup-select.label',
  component: LookupSelect,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.String(),
      tableId: ExType.Table(),
      valueField: ExType.Field(),
      labelField: ExType.Field(),
      columns: Type.Array(Type.Object({
        field: ExType.Field(),
        size: Type.Optional(Type.Number()),
        filterable: Type.Optional(Type.Boolean()),
        class: Type.Optional(Type.String()),
        style: Type.Optional(Type.String()),
        title: Type.Optional(Type.String()),
        titleClass: Type.Optional(Type.String()),
        titleStyle: Type.Optional(Type.String()),
      })),
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
      optionsDense: Type.Boolean(),
      displayValue: Type.String(),
      hideSelected: Type.Boolean(),
      maxValues: Type.Number(),
      useChips: Type.Boolean(),
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
      popupShow: ExType.Action(),
      popupHide: ExType.Action(),
    }),
  ]),
  defaultValues: {
    valueField: '_id',
    dense: true,
    clearable: true,
    outlined: true,
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
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'tableId',
        'valueField',
        'labelField',
        'columns',
        'multiple',
        'displayValue',
        'maxValues',
        'clearable',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'optionsDense',
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
        'backgroundColor',
        'border',
        'padding',
        'margin',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'clear',
        'input',
        'popupShow',
        'popupHide',
        'focus',
        'blur',
        'keydown',
        'keypress',
        'keyup',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    clear: () => ({}),
    input: (value: string) => ({ value }),
    popupShow: () => ({}),
    popupHide: () => ({}),
  },
} as TFormComponent

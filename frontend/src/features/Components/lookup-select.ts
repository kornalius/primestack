import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import LookupSelect from '@/features/Tables/components/LookupSelect.vue'
import { lookupSchema } from '@/shared/schemas/table'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
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
      value: Type.String(),
      tableId: ExType.Table(),
      query: ExType.Query(),
      valueField: ExType.Field(),
      labelField: ExType.Field(),
      columns: Type.Array(lookupSchema),
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
  modelValueField: 'value',
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
        'renderWhen',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'value',
        'field',
        { name: 'tableId', label: 'Table' },
        'query',
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
    popupShow: () => ({}),
    popupHide: () => ({}),
  },
} as TFormComponent

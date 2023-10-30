import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import TagsSelect from '@/features/Tables/components/TagsSelect.vue'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'tags-select',
  icon: 'mdi-form-select',
  label: 'components.tags-select.label',
  component: TagsSelect,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.String(),
      tableId: ExType.Table(),
      field: ExType.Field(),
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
      remove: ExType.Action(),
      add: ExType.Action(),
      newValue: ExType.Action(),
      popupShow: ExType.Action(),
      popupHide: ExType.Action(),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    dense: true,
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
        'value',
        'tableId',
        'field',
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
        'remove',
        'add',
        'newValue',
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
    newValue: (value: string) => ({ value }),
    popupShow: () => ({}),
    popupHide: () => ({}),
  },
} as TFormComponent

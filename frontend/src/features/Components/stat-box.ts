import { StringEnum, Type } from '@feathersjs/typebox'
import ExType from '@/shared/extypes'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import {
  validCurrencyCodes, ValueBoxFormatStyle, ValueBoxTextStyle,
} from '@/features/Fields/interfaces'
import StatBox from '@/features/Tables/components/StatBox.vue'
import {
  properties, commonProperties, defaultStyleValues, styleNames, sizeString,
} from './common'

const StatType = StringEnum([
  'count',
  'avg',
  'sum',
  'min',
  'max',
  'empty',
  '!empty',
  '%empty',
  '%!empty',
])

export default {
  type: 'stat-box',
  icon: 'mdi-pi-box',
  label: 'components.stat-box.label',
  component: StatBox,
  schema: properties([
    commonProperties.style,
    Type.Object({
      type: StatType,
      tableId: ExType.Table(),
      field: ExType.Field(),
      groupFields: Type.Array(ExType.Field()),
      filter: ExType.Query(),
      valueColor: ExType.Color({ quasarPalette: true }),
      valueFormat: StringEnum(ValueBoxFormatStyle),
      valueStyle: StringEnum(ValueBoxTextStyle),
      valueDigits: Type.Number({ minimum: 0, maximum: 20 }),
      valueCurrency: StringEnum(validCurrencyCodes),
      valueCurrencyNarrow: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      label: Type.String(),
      labelColor: ExType.Color({ quasarPalette: true }),
      labelStyle: StringEnum(ValueBoxTextStyle),
      icon: ExType.Icon(),
      iconColor: ExType.Color({ quasarPalette: true }),
      tag: Type.String(),
      tagColor: ExType.Color({ quasarPalette: true }),
      tagStyle: StringEnum(ValueBoxTextStyle),
      diff: Type.Number(),
      diffFormat: StringEnum(ValueBoxFormatStyle),
      diffDigits: Type.Number({ minimum: 0, maximum: 20 }),
      diffCurrency: StringEnum(validCurrencyCodes),
      diffCurrencyNarrow: Type.Boolean(),
      diffColor: ExType.Color({ quasarPalette: true }),
      diffStyle: StringEnum(ValueBoxTextStyle),
      diffIcon: ExType.Icon(),
      diffIconColor: ExType.Color({ quasarPalette: true }),
      diffIconSize: sizeString,
      diffIconSuffix: Type.Boolean(),
    }),
  ], false),
  defaultValues: {
    type: 'count',
    color: 'indigo-5',
    icon: 'mdi-chart-line',
    labelColor: 'grey-1',
    labelStyle: 'h6',
    valueColor: 'grey-1',
    valueStyle: 'h5',
    diffColor: 'green-6',
    diffStyle: 'subtitle1',
    diffIconColor: 'green-6',
    diffIconSize: 'xs',
    diffIcon: 'mdi-chevron-up',
    tagColor: 'orange',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'type',
        {
          label: 'Table',
          sectionColor: 'pink-1',
          children: [
            'tableId',
            'field',
            'groupFields',
            'filter',
          ],
        },
        'icon',
        'label',
        {
          label: 'Value',
          sectionColor: 'orange-1',
          children: [
            { name: 'valueFormat', label: 'Format' },
            { name: 'valueDigits', label: 'Digits' },
            { name: 'valueCurrency', label: 'Currency' },
            { name: 'valueCurrencyNarrow', label: 'Narrow Currency' },
          ],
        },
        {
          label: 'Difference Value',
          sectionColor: 'purple-1',
          children: [
            { name: 'diffIcon', label: 'Icon' },
            { name: 'diffIconSize', label: 'Icon Size' },
            { name: 'diffIconSuffix', label: 'Icon Suffix' },
            { name: 'diffFormat', label: 'Format' },
            { name: 'diffDigits', label: 'Digits' },
            { name: 'diffCurrency', label: 'Currency' },
            { name: 'diffCurrencyNarrow', label: 'Narrow Currency' },
          ],
        },
        'tag',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        {
          label: 'Colors',
          sectionColor: 'red-1',
          children: [
            'color',
            'iconColor',
            'labelColor',
            'tagColor',
            'diffColor',
            'diffIconColor',
            'valueColor',
          ],
        },
        {
          label: 'Styles',
          sectionColor: 'purple-1',
          children: [
            'labelStyle',
            'tagStyle',
            'diffStyle',
            'valueStyle',
          ],
        },
        ...styleNames,
      ],
    },
  },
} as TFormComponent

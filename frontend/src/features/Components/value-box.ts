import { StringEnum, Type } from '@feathersjs/typebox'
import ExType from '@/shared/extypes'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import {
  validCurrencyCodes, ValueBoxFormatStyle, ValueBoxSize, ValueBoxTextStyle,
} from '@/features/Fields/interfaces'
import ValueBox from '@/features/Fields/components/ValueBox.vue'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'value-box',
  icon: 'mdi-chevron-up-box',
  label: 'components.value-box.label',
  component: ValueBox,
  schema: properties([
    commonProperties.style,
    Type.Object({
      modelValue: Type.Number(),
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
      diffIconSize: StringEnum(ValueBoxSize),
      diffIconSuffix: Type.Boolean(),
    }),
  ], false),
  defaultValues: {
    color: 'indigo-5',
    icon: 'mdi-chart-line',
    labelColor: 'grey-1',
    labelStyle: 'h6',
    valueColor: 'grey-1',
    valueStyle: 'h5',
    valueFormat: 'decimal',
    diffColor: 'green-6',
    diffStyle: 'subtitle1',
    diffIconColor: 'green-6',
    diffIconSize: 'xs',
    diffIcon: 'mdi-chevron-up',
    diffFormat: 'percent',
    tagColor: 'orange',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'icon',
        'label',
        'modelValue',
        'valueFormat',
        'valueDigits',
        'valueCurrency',
        'valueCurrencyNarrow',
        'diff',
        'diffIcon',
        'diffIconSize',
        'diffIconSuffix',
        'diffFormat',
        'diffDigits',
        'diffCurrency',
        'diffCurrencyNarrow',
        'tag',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'color',
        'iconColor',
        'labelColor',
        'labelStyle',
        'tagColor',
        'tagStyle',
        'diffColor',
        'diffStyle',
        'diffIconColor',
        'valueColor',
        'valueStyle',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

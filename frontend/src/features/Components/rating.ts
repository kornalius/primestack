import { QRating } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { actionIcon, contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'rating',
  icon: 'mdi-star',
  label: 'components.rating.label',
  component: QRating,
  numericInput: true,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.events,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      value: Type.Number(),
      icon: ExType.Icon(),
      iconSelected: ExType.Icon(),
      iconHalf: ExType.Icon(),
      max: Type.Number(),
      noReset: Type.Boolean(),
      noDimming: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      colorSelected: ExType.Color({ quasarPalette: true }),
      colorHalf: ExType.Color({ quasarPalette: true }),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    dense: true,
    icon: 'mdi-star-outline',
    iconSelected: 'mdi-star',
    iconHalf: 'mdi-star-half-full',
    max: 5,
    size: 'sm',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'value',
        'field',
        'max',
        'disable',
        'readonly',
        'icon',
        'iconSelected',
        'iconHalf',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        {
          label: 'Colors',
          sectionColor: 'red-1',
          children: [
            'color',
            'colorSelected',
            'colorHalf',
          ],
        },
        'noReset',
        'noDimming',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
  },
} as TFormComponent

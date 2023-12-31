import { QSlider } from 'quasar'
import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, sizeString, defaultStyleValues, commonEventArgs, styleNames,
} from './common'

export default {
  type: 'slider',
  icon: 'mdi-tune-variant',
  label: 'components.slider.label',
  component: QSlider,
  numericInput: true,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      value: Type.Number(),
      label: Type.String(),
      min: Type.Number(),
      max: Type.Number(),
      innerMin: Type.Number(),
      innerMax: Type.Number(),
      step: Type.Number(),
      snap: Type.Boolean(),
      reverse: Type.Boolean(),
      vertical: Type.Boolean(),
      labelAlways: Type.Boolean(),
      switchLabelSide: Type.Boolean(),
      switchMarkerLabelSide: Type.Boolean(),
      thumbSize: sizeString,
      trackSize: sizeString,
      markers: Type.Union([Type.Boolean(), Type.Number()]),
      markerLabels: Type.Boolean(),
      color: ExType.Color({ quasarPalette: true }),
      labelColor: ExType.Color({ quasarPalette: true }),
      labelTextColor: ExType.Color({ quasarPalette: true }),
      thumbColor: ExType.Color({ quasarPalette: true }),
      innerTrackColor: ExType.Color({ quasarPalette: true }),
      selectionColor: ExType.Color({ quasarPalette: true }),
      change: ExType.Action(),
      pan: ExType.Action(),
    }),
  ]),
  modelValueField: 'value',
  defaultValues: {
    step: 1,
    snap: true,
    max: 10,
    innerMax: 10,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'label',
        'markers',
        'renderWhen',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'value',
        'field',
        'min',
        'max',
        'innerMin',
        'innerMax',
        'step',
        'snap',
        'reverse',
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
            'labelTextColor',
            'thumbColor',
            'innerTrackColor',
            'selectionColor',
          ],
        },
        'vertical',
        'labelAlways',
        'switchLabelSide',
        'switchMarkerLabelSide',
        'thumbSize',
        'trackSize',
        'markerLabels',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'change',
        'pan',
        'focus',
        'blur',
        'keydown',
        'keyup',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    change: (value) => ({ value }),
    pan: (phase) => ({ phase }),
  },
} as TFormComponent

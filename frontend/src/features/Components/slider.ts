import { QSlider } from 'quasar'
import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, sizeString, defaultStyleValues, commonEventArgs,
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
      modelValue: Type.Number(),
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
      color: ExType.Color(),
      labelColor: ExType.Color(),
      labelTextColor: ExType.Color(),
      thumbColor: ExType.Color(),
      innerTrackColor: ExType.Color(),
      selectionColor: ExType.Color(),
      change: ExType.Action(),
      pan: ExType.Action(),
    }),
  ]),
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
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'name',
        'modelValue',
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
        'vertical',
        'labelAlways',
        'switchLabelSide',
        'switchMarkerLabelSide',
        'thumbSize',
        'trackSize',
        'markerLabels',
        'labelColor',
        'labelTextColor',
        'thumbColor',
        'innerTrackColor',
        'selectionColor',
        'border',
        'padding',
        'margin',
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
        'keypress',
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

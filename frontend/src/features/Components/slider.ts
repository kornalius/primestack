import { QSlider } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, sizeString } from './common'

export default {
  type: 'slider',
  icon: 'mdi-tune-variant',
  label: 'Slider',
  component: QSlider,
  schema: properties([
    commonProperties.state,
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
      color: Type.String({ color: true }),
      labelColor: Type.String({ color: true }),
      labelTextColor: Type.String({ color: true }),
      thumbColor: Type.String({ color: true }),
      innerTrackColor: Type.String({ color: true }),
      selectionColor: Type.String({ color: true }),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    step: 1,
    snap: true,
    max: 10,
    innerMax: 10,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'disable',
        'readonly',
        'label',
        'markers',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'modelValue',
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent
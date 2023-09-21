import { QRange } from 'quasar'
import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import {
  properties,
  commonProperties,
  sizeString,
  defaultStyleValues,
} from './common'

export default {
  type: 'range',
  icon: 'mdi-arrow-left-right',
  label: 'Range',
  component: QRange,
  schema: properties([
    commonProperties.state,
    commonProperties.style,
    commonProperties.events,
    Type.Object({
      modelValue: Type.Object({ min: Type.Number(), max: Type.Number() }),
      min: Type.Number(),
      max: Type.Number(),
      innerMin: Type.Number(),
      innerMax: Type.Number(),
      step: Type.Number(),
      snap: Type.Boolean(),
      labelAlways: Type.Boolean(),
      reverse: Type.Boolean(),
      vertical: Type.Boolean(),
      markers: Type.Union([Type.Boolean(), Type.Number()]),
      markerLabels: Type.Boolean(),
      dragRange: Type.Boolean(),
      dragOnlyRange: Type.Boolean(),
      leftLabelValue: Type.String(),
      rightLabelValue: Type.String(),
      switchLabelSide: Type.Boolean(),
      switchMarkerLabelSide: Type.Boolean(),
      thumbSize: sizeString,
      trackSize: sizeString,
      labelColor: Type.String({ color: true }),
      labelTextColor: Type.String({ color: true }),
      trackColor: Type.String({ color: true }),
      thumbColor: Type.String({ color: true }),
      selectionColor: Type.String({ color: true }),
      leftLabelColor: Type.String({ color: true }),
      leftLabelTextColor: Type.String({ color: true }),
      rightLabelColor: Type.String({ color: true }),
      rightLabelTextColor: Type.String({ color: true }),
      leftThumbColor: Type.String({ color: true }),
      rightThumbColor: Type.String({ color: true }),
      change: Type.String({ objectid: true, action: true }),
      pan: Type.String({ objectid: true, action: true }),
    }),
  ]),
  defaultValues: {
    modelValue: { min: 0, max: 0 },
    step: 1,
    snap: true,
    max: 10,
    innerMax: 10,
    labelAlways: true,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'reverse',
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
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'labelColor',
        'labelTextColor',
        'leftLabelColor',
        'leftLabelTextColor',
        'rightLabelColor',
        'rightLabelTextColor',
        'labelAlways',
        'switchLabelSide',
        'switchMarkerLabelSide',
        'vertical',
        'markerLabels',
        'dragRange',
        'dragOnlyRange',
        'selectionColor',
        'trackSize',
        'trackColor',
        'thumbSize',
        'thumbColor',
        'leftThumbColor',
        'rightThumbColor',
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
      ],
    },
  },
} as TFormComponent

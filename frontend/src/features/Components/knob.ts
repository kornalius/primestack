import { QKnob } from 'quasar'
import { Type } from '@feathersjs/typebox'
import {
  actionIcon, contentIcon, modelIcon, styleIcon,
} from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'knob',
  icon: 'mdi-knob',
  label: 'components.knob.label',
  component: QKnob,
  numericInput: true,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    commonProperties.events,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.Number({ min: 0, max: 360 }),
      angle: Type.Number({ min: 0, max: 360 }),
      reverse: Type.Boolean(),
      instantFeedback: Type.Boolean(),
      showValue: Type.Boolean(),
      min: Type.Number(),
      max: Type.Number(),
      innerMin: Type.Number(),
      innerMax: Type.Number(),
      step: Type.Number(),
      fontSize: Type.String(),
      color: ExType.Color({ quasarPalette: true }),
      centerColor: ExType.Color({ quasarPalette: true }),
      trackColor: ExType.Color({ quasarPalette: true }),
      thickness: Type.Number(),
      change: ExType.Action(),
      dragValue: ExType.Action(),
    }),
  ]),
  defaultValues: {
    thickness: 1,
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'disable',
        'readonly',
        'angle',
        'instantFeedback',
        'showValue',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'reverse',
        'min',
        'max',
        'innerMin',
        'innerMax',
        'step',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'centerColor',
        'trackColor',
        'fontSize',
        'thickness',
        ...styleNames,
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'change',
        'dragValue',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    change: (value: number) => ({ value }),
    dragValue: (value: number) => ({ value }),
  },
} as TFormComponent

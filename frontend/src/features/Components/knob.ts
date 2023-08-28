import { QKnob } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'knob',
  icon: 'mdi-knob',
  label: 'Knob',
  component: QKnob,
  numericInput: true,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
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
      color: Type.String({ color: true }),
      centerColor: Type.String({ color: true }),
      trackColor: Type.String({ color: true }),
      thickness: Type.Number(),
    }),
  ]),
  defaultValues: {
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
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

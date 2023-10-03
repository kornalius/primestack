import { QCircularProgress } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'progress',
  icon: 'mdi-progress-helper',
  label: 'components.progress.label',
  component: QCircularProgress,
  numericInput: true,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.Number({ min: 0, max: 360 }),
      angle: Type.Number({ min: 0, max: 360 }),
      indeterminate: Type.Boolean(),
      reverse: Type.Boolean(),
      rounded: Type.Boolean(),
      instantFeedback: Type.Boolean(),
      showValue: Type.Boolean(),
      min: Type.Number(),
      max: Type.Number(),
      fontSize: Type.String(),
      color: ExType.Color(),
      centerColor: ExType.Color(),
      trackColor: ExType.Color(),
      thickness: Type.Number({ step: 0.1 }),
      animationSpeed: Type.Number(),
    }),
  ]),
  defaultValues: {
    color: 'primary',
    indeterminate: true,
    thickness: 0.2,
    size: 'sm',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
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
        'indeterminate',
        'min',
        'max',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'color',
        'centerColor',
        'trackColor',
        'thickness',
        'fontSize',
        'animationSpeed',
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

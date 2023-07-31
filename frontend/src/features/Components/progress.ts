import { QCircularProgress } from 'quasar'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'progress',
  icon: 'mdi-progress-helper',
  label: 'Progress',
  component: QCircularProgress,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
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
      color: Type.String({ color: true }),
      centerColor: Type.String({ color: true }),
      trackColor: Type.String({ color: true }),
      thickness: Type.Number({ step: 0.1 }),
      animationSpeed: Type.Number(),
    }),
    commonProperties.style,
  ]),
  defaultValues: {
    color: 'primary',
    indeterminate: true,
    thickness: 0.2,
    size: 'sm',
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
        'dense',
        'size',
        'color',
        'centerColor',
        'trackColor',
        'thickness',
        'fontSize',
        'animationSpeed',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

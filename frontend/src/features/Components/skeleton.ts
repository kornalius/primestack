import { QSkeleton } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'skeleton',
  icon: 'mdi-timer-sand',
  label: 'Skeleton',
  component: QSkeleton,
  nokey: true,
  schema: properties([
    commonProperties.state,
    commonProperties.size,
    Type.Object({
      type: StringEnum([
        'rect',
        'text',
        'circle',
        'QBtn',
        'QBadge',
        'QChip',
        'QToolbar',
        'QCheckbox',
        'QRadio',
        'QToggle',
        'QSlider',
        'QRange',
        'QInput',
        'QAvatar',
      ]),
      animation: StringEnum([
        'wave',
        'pulse',
        'pulse-x',
        'pulse-y',
        'fade',
        'blink',
        'none',
      ]),
      animationSpeed: Type.Number(),
      square: Type.Boolean(),
      bordered: Type.Boolean(),
      width: Type.String(),
      height: Type.String(),
    }),
    Type.Omit(commonProperties.style, ['dense']),
  ], false),
  defaultValues: {
    type: 'rect',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'type',
        'disable',
        'readonly',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'size',
        'width',
        'height',
        'animation',
        'animationSpeed',
        'square',
        'bordered',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

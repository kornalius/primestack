import { QSkeleton } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties, defaultStyleValues } from './common'

export default {
  type: 'skeleton',
  icon: 'mdi-timer-sand',
  label: 'components.skeleton.label',
  component: QSkeleton,
  nokey: true,
  schema: properties([
    commonProperties.size,
    Type.Omit(commonProperties.style, ['dense']),
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
  ], false),
  defaultValues: {
    type: 'rect',
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'type',
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
        'border',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

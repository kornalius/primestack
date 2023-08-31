import { QVideo } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'video',
  icon: 'mdi-movie-open',
  label: 'Video',
  component: QVideo,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      modelValue: Type.String(),
      title: Type.String(),
      ratio: Type.String(),
      loading: StringEnum(['eager', 'lazy']),
      fetchpriority: StringEnum(['high', 'low', 'auto']),
      reffererpolicy: StringEnum([
        'no-referrer',
        'no-referrer-when-downgrade',
        'origin',
        'origin-when-cross-origins',
        'name-origin',
        'strict-origin',
        'strict-origin-when-cross-origin',
        'unsafe-url',
      ]),
    }),
  ]),
  defaultValues: {
    loading: 'eager',
    fetchpriority: 'auto',
    referrerpolicy: 'strict-origin-when-cross-origin',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'modelValue',
        'field',
        'title',
        'fetchpriority',
        'reffererpolicy',
        'loading',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'ratio',
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

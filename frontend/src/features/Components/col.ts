import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { properties, commonProperties } from './common'

export default {
  type: 'col',
  icon: 'mdi-table-column',
  label: 'Column',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      col: Type.String({
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '7', value: '7' },
          { label: '8', value: '8' },
          { label: '9', value: '9' },
          { label: '10', value: '10' },
          { label: '11', value: '11' },
          { label: '12', value: '12' },
          { label: 'A', value: 'auto' },
        ],
        toggles: true,
        clearable: true,
      }),
    }),
  ], false),
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'name',
        'col',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'padding',
        'margin',
      ],
    },
  },
} as TFormComponent

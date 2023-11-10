import { Type } from '@feathersjs/typebox'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import { flexSizeString, sizeString } from '@/shared/interfaces/commons'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'col',
  icon: 'mdi-table-column',
  label: 'components.col.label',
  col: true,
  nokey: true,
  hidden: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      col: flexSizeString(),
      offset: flexSizeString(false),
      breakpoint: sizeString,
      breakpointCol: flexSizeString(),
      backgroundColor: ExType.Color(),
    }),
  ], false),
  defaultValues: {
    ...defaultStyleValues,
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'col',
        'offset',
        {
          label: 'Breakpoint',
          children: [
            { label: 'Screen size', name: 'breakpoint' },
            { label: 'Size', name: 'breakpointCol' },
          ],
        },
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'backgroundColor',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

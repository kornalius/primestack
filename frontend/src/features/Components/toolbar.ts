import { Type } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { contentIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, defaultStyleValues, styleNames,
} from './common'

export default {
  type: 'toolbar',
  icon: 'mdi-window-minimize',
  label: 'components.toolbar.label',
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      backgroundColor: ExType.Color(),
    }),
  ], false),
  defaultValues: {
    ...defaultStyleValues,
    _columns: [
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        ...defaultStyleValues,
      },
    ],
  },
  editStyles: {
    minHeight: '50px',
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'renderWhen',
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

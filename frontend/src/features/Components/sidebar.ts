import hexObjectId from 'hex-object-id'
import { Type } from '@feathersjs/typebox'
import { contentIcon, modelIcon, styleIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import { AnyData } from '@/shared/interfaces/commons'
import ExType from '@/shared/extypes'
// eslint-disable-next-line import/no-cycle
import { useFormElements } from '@/features/Forms/composites'
import { useAppEditor } from '@/features/Editor/store'
import {
  properties, commonProperties, styleNames, defaultStyleValues,
} from './common'

export default {
  type: 'sidebar',
  icon: 'mdi-page-layout-sidebar-left',
  label: 'components.sidebar.label',
  row: true,
  schema: properties([
    Type.Omit(commonProperties.style, ['dense']),
    Type.Object({
      opened: Type.Boolean(),
      right: Type.Boolean(),
      bordered: Type.Boolean(),
      closeable: Type.Boolean(),
      closeIcon: ExType.Icon(),
      openIcon: ExType.Icon(),
      menuIcon: ExType.Icon(),
      openTooltip: Type.String(),
      closeTooltip: Type.String(),
      backgroundColor: ExType.Color(),
    }),
  ], true),
  modelValueField: 'opened',
  disabled: (): boolean => {
    const editor = useAppEditor()
    const { isSidebar } = useFormElements()
    return editor.flattenFormFields().find((f) => isSidebar(f)) !== undefined
  },
  elementClasses: (field: AnyData) => ({
    right: field.right,
  }),
  elementStyles: () => ({
    position: 'absolute',
    top: 0,
    right: 0,
    width: 'unset !important',
    height: '100% !important',
  }),
  defaultValues: {
    ...defaultStyleValues,
    opened: true,
    closeable: true,
    right: true,
    bordered: true,
    _columns: [
      {
        _id: hexObjectId(),
        _type: 'col',
        _fields: [],
        virtualScrollItemSize: 24,
      },
    ],
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'closeable',
        {
          label: 'Icons',
          children: [
            { label: 'Menu', name: 'menuIcon' },
            { label: 'Open', name: 'openIcon' },
            { label: 'Close', name: 'closeIcon' },
          ],
        },
        {
          label: 'Tooltips',
          children: [
            { label: 'Open', name: 'openTooltip' },
            { label: 'Close', name: 'closeTooltip' },
          ],
        },
        'renderWhen',
      ],
    },
    model: {
      icon: modelIcon,
      names: [
        'opened',
        'field',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'bordered',
        'backgroundColor',
        ...styleNames,
      ],
    },
  },
} as TFormComponent

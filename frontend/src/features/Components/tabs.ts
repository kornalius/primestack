import { QTabs } from 'quasar'
import { StringEnum, Type } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { contentIcon, styleIcon, actionIcon } from '@/shared/icons'
import { TFormComponent } from '@/shared/interfaces/forms'
import ExType from '@/shared/extypes'
import {
  properties, commonProperties, commonEventArgs, clickEvent, updateEvent, focusEvent,
} from './common'

export default {
  type: 'tabs',
  icon: 'mdi-tab',
  label: 'components.tabs.label',
  component: QTabs,
  schema: properties([
    commonProperties.state,
    commonProperties.events,
    Type.Object({
      currentTab: Type.String(),
      breakpoint: Type.Number(),
      vertical: Type.Boolean(),
      stretch: Type.Boolean(),
      shrink: Type.Boolean(),
      outsideArrows: Type.Boolean(),
      mobileArrows: Type.Boolean(),
      switchIndicator: Type.Boolean(),
      narrowIndicator: Type.Boolean(),
      inlineLabel: Type.Boolean(),
      noCaps: Type.Boolean(),
      align: StringEnum(['left', 'center', 'right', 'justify']),
      leftIcon: ExType.Icon(),
      rightIcon: ExType.Icon(),
      activeColor: ExType.Color({ quasarPalette: true }),
      activeBgColor: ExType.Color({ quasarPalette: true }),
      dense: Type.Boolean(),
      click: ExType.Action(),
      update: ExType.Action(),
      focus: ExType.Action(),
      blur: ExType.Action(),
    }),
  ]),
  modelValueField: 'currentTab',
  defaultValues: {
    dense: true,
    align: 'left',
    _columns: [{
      _id: hexObjectId(),
      _type: 'tab',
      name: 'Tab1',
      label: 'Tab 1',
      _fields: [],
    }],
  },
  categories: {
    content: {
      icon: contentIcon,
      names: [
        'currentTab',
        'field',
        'disable',
        'align',
        'breakpoint',
        'vertical',
        'leftIcon',
        'rightIcon',
        'renderWhen',
      ],
    },
    style: {
      icon: styleIcon,
      names: [
        'dense',
        'stretch',
        'shrink',
        'outsideArrows',
        'mobileArrows',
        'switchIndicator',
        'narrowIndicator',
        'activeColor',
        'activeBgColor',
        'inlineLabel',
        'noCaps',
      ],
    },
    action: {
      icon: actionIcon,
      names: [
        'update',
        'click',
        'focus',
        'blur',
      ],
    },
  },
  eventArgs: {
    ...commonEventArgs,
    click: clickEvent,
    update: updateEvent,
    focus: focusEvent,
    blur: focusEvent,
  },
} as TFormComponent

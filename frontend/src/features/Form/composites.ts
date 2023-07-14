import hexObjectId from 'hex-object-id'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import {
  QBtn,
  QBtnToggle,
  QCheckbox,
  QChip, QCircularProgress,
  QIcon, QImg,
  QInput, QKnob,
  QOptionGroup,
  QRange, QRating,
  QSelect, QSeparator, QSkeleton,
  QSlider, QSpace, QSpinnerIos,
  QToggle, QVideo,
} from 'quasar'
import {
  TObject, Type, StringEnum, TSchema,
} from '@feathersjs/typebox'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import DateField from '@/features/Fields/components/DateField.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import FormElementRow from '@/features/Form/components/Editor/FormElementRow.vue'
import { AnyData } from '@/shared/interfaces/commons'
import { useSchema } from '@/composites/schema'

const { defaultValueForSchema } = useSchema()

const sizeEnum = StringEnum(['xs', 'sm', 'md', 'lg', 'xl'])

export const commonProperties = {
  name: Type.Object({
    name: Type.String(),
  }),

  state: Type.Object({
    disable: Type.Boolean(),
    readonly: Type.Boolean(),
  }),

  style: Type.Object({
    dense: Type.Boolean(),
    padding: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { skip: true }),
    margin: Type.Object({
      top: Type.String(),
      left: Type.String(),
      bottom: Type.String(),
      right: Type.String(),
    }, { skip: true }),
  }),

  size: Type.Object({
    size: sizeEnum,
  }),
}

const componentForType = {
  text: QInput,
  number: QInput,
  checkbox: QCheckbox,
  toggle: QToggle,
  button: QBtn,
  buttonToggle: QBtnToggle,
  optionGroup: QOptionGroup,
  select: QSelect,
  chip: QChip,
  date: DateField,
  time: TimeField,
  color: ColorField,
  iconSelect: IconField,
  row: FormElementRow,
  slider: QSlider,
  range: QRange,
  icon: QIcon,
  img: QImg,
  knob: QKnob,
  progress: QCircularProgress,
  rating: QRating,
  separator: QSeparator,
  skeleton: QSkeleton,
  space: QSpace,
  spinner: QSpinnerIos,
  video: QVideo,
}

export const properties = (props: TObject[]) => Type.Intersect(
  [
    commonProperties.name,
    ...props,
  ],
)

const components = [
  {
    type: 'text',
    icon: 'mdi-form-textbox',
    label: 'Text',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.Union([Type.String(), Type.Null(), Type.Undefined()]),
        mask: Type.String(),
        fillMask: Type.String(),
        unmaskedValue: Type.Boolean(),
        label: Type.String(),
        labelColor: Type.String({ color: true }),
        stackLabel: Type.Boolean(),
        hint: Type.String(),
        hideHint: Type.Boolean(),
        prefix: Type.String(),
        suffix: Type.String(),
        clearable: Type.Boolean(),
        loading: Type.Boolean(),
        counter: Type.Boolean(),
        autogrow: Type.Boolean(),
        filled: Type.Boolean(),
        outlined: Type.Boolean(),
        square: Type.Boolean(),
        borderless: Type.Boolean(),
        standout: Type.Boolean(),
        rounded: Type.Boolean(),
        itemAligned: Type.Boolean(),
        type: StringEnum([
          'text',
          'password',
          'area',
          'email',
          'search',
          'file',
          'number',
          'url',
          'time',
          'date',
        ]),
        maxLength: Type.Number(),
        color: Type.String({ color: true }),
        bgColor: Type.String({ color: true }),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      type: 'text',
      dense: true,
      outlined: true,
    },
  },
  {
    type: 'checkbox',
    icon: 'mdi-check',
    label: 'Checkbox',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.Boolean(),
        label: Type.String(),
        leftLabel: Type.Boolean(),
        color: Type.String({ color: true }),
        keepColor: Type.Boolean(),
        checkedIcon: Type.String({ icon: true }),
        uncheckedIcon: Type.String({ icon: true }),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'toggle',
    icon: 'mdi-toggle-switch-off-outline',
    label: 'Toggle',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        modelValue: Type.Boolean(),
        label: Type.String(),
        leftLabel: Type.Boolean(),
        color: Type.String({ color: true }),
        iconColor: Type.String({ color: true }),
        keepColor: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'buttonToggle',
    icon: 'mdi-checkbox-multiple-blank',
    label: 'Buttons',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        spread: Type.Boolean(),
        noCaps: Type.Boolean(),
        noWrap: Type.Boolean(),
        stack: Type.Boolean(),
        stretch: Type.Boolean(),
        clearable: Type.Boolean(),
        options: Type.Array(Type.Object({
          label: Type.String(),
          value: Type.String(),
          icon: Type.String({ icon: true }),
        })),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'optionGroup',
    icon: 'mdi-radiobox-marked',
    label: 'Option Group',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        color: Type.String({ color: true }),
        keepColor: Type.Boolean(),
        type: StringEnum(['radio', 'checkbox', 'toggle']),
        leftLabel: Type.Boolean(),
        inline: Type.Boolean(),
        options: Type.Array(Type.Object({
          label: Type.String(),
          value: Type.String(),
          disable: Type.Boolean(),
        })),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      type: 'radio',
    },
    editStyles: {
      minHeight: '40px',
    },
  },
  {
    type: 'button',
    icon: 'mdi-button-pointer',
    label: 'Button',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        modelValue: Type.String(),
        label: Type.String(),
        color: Type.String({ color: true }),
        textColor: Type.String({ color: true }),
        to: Type.String(),
        target: Type.String(),
        replace: Type.Boolean(),
        loading: Type.Boolean(),
        noCaps: Type.Boolean(),
        noWrap: Type.Boolean(),
        align: StringEnum([
          'left',
          'right',
          'center',
          'around',
          'between',
          'spaced',
        ]),
        icon: Type.String({ icon: true }),
        stack: Type.Boolean(),
        stretch: Type.Boolean(),
        round: Type.Boolean(),
        rounded: Type.Boolean(),
        glossy: Type.Boolean(),
        outline: Type.Boolean(),
        flat: Type.Boolean(),
        push: Type.Boolean(),
        square: Type.Boolean(),
        unelevated: Type.Boolean(),
        fab: Type.Boolean(),
        fabMini: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      align: 'center',
    },
  },
  {
    type: 'date',
    icon: 'mdi-calendar',
    label: 'Date',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        landscape: Type.Boolean(),
        outlined: Type.Boolean(),
        yearsInMonthView: Type.Boolean(),
        title: Type.String(),
        subTitle: Type.String(),
        todayBtn: Type.Boolean(),
        minimal: Type.Boolean(),
        mask: Type.String(),
        calendar: StringEnum(['gregorian', 'persian']),
        defaultYearMonth: Type.String(),
        defaultView: StringEnum(['Calendar', 'Months', 'Years']),
        firstDayOfWeek: Type.Number(),
        multiple: Type.Boolean(),
        range: Type.Boolean(),
        emitImmediately: Type.Boolean(),
        navigationMinYearMonth: Type.String(),
        navigationMaxYearMonth: Type.String(),
        noUnset: Type.Boolean(),
        color: Type.String({ color: true }),
        textColor: Type.String({ color: true }),
        square: Type.Boolean(),
        flat: Type.Boolean(),
        bordered: Type.Boolean(),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      dense: true,
      outlined: true,
      calendar: 'gregorian',
      defaultView: 'Calendar',
      hideBottomSpace: true,
    },
  },
  {
    type: 'time',
    icon: 'mdi-clock-outline',
    label: 'Time',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        landscape: Type.Boolean(),
        outlined: Type.Boolean(),
        withSeconds: Type.Boolean(),
        nowBtn: Type.Boolean(),
        mask: Type.String(),
        calendar: StringEnum(['gregorian', 'persian']),
        color: Type.String({ color: true }),
        textColor: Type.String({ color: true }),
        square: Type.Boolean(),
        flat: Type.Boolean(),
        bordered: Type.Boolean(),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      dense: true,
      outlined: true,
      calendar: 'gregorian',
      hideBottomSpace: true,
    },
  },
  {
    type: 'select',
    icon: 'mdi-form-select',
    label: 'Select',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        virtualScrollHorizontal: Type.Boolean(),
        loading: Type.Boolean(),
        clearable: Type.Boolean(),
        tableColspan: Type.Number(),
        noErrorIcon: Type.Boolean(),
        label: Type.String(),
        labelColor: Type.String({ color: true }),
        color: Type.String({ color: true }),
        bgColor: Type.String({ color: true }),
        stackLabel: Type.Boolean(),
        hint: Type.String(),
        hideHint: Type.Boolean(),
        prefix: Type.String(),
        suffix: Type.String(),
        multiple: Type.Boolean(),
        emitValue: Type.Boolean(),
        options: Type.Array(Type.Object({
          label: Type.String(),
          value: Type.String(),
        })),
        optionLabel: Type.String(),
        optionValue: Type.String(),
        optionDisable: Type.String(),
        optionsDense: Type.Boolean(),
        displayValue: Type.String(),
        hideSelected: Type.Boolean(),
        maxValues: Type.Number(),
        useChips: Type.Boolean(),
        useInput: Type.Boolean(),
        filled: Type.Boolean(),
        outlined: Type.Boolean(),
        square: Type.Boolean(),
        borderless: Type.Boolean(),
        standout: Type.Boolean(),
        rounded: Type.Boolean(),
        itemAligned: Type.Boolean(),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      dense: true,
      outlined: true,
      emitValue: true,
      optionLabel: 'label',
      optionValue: 'value',
      optionDisable: 'disable',
      optionsDense: true,
    },
  },
  {
    type: 'iconSelect',
    icon: 'mdi-form-select',
    label: 'Icon Select',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        virtualScrollHorizontal: Type.Boolean(),
        loading: Type.Boolean(),
        clearable: Type.Boolean(),
        tableColspan: Type.Number(),
        noErrorIcon: Type.Boolean(),
        label: Type.String(),
        labelColor: Type.String({ color: true }),
        color: Type.String({ color: true }),
        bgColor: Type.String({ color: true }),
        stackLabel: Type.Boolean(),
        hint: Type.String(),
        hideHint: Type.Boolean(),
        prefix: Type.String(),
        suffix: Type.String(),
        multiple: Type.Boolean(),
        hideSelected: Type.Boolean(),
        maxValues: Type.Number(),
        useChips: Type.Boolean(),
        useInput: Type.Boolean(),
        filled: Type.Boolean(),
        outlined: Type.Boolean(),
        square: Type.Boolean(),
        borderless: Type.Boolean(),
        standout: Type.Boolean(),
        rounded: Type.Boolean(),
        itemAligned: Type.Boolean(),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      dense: true,
      outlined: true,
      emitValue: true,
      useInput: true,
    },
  },
  {
    type: 'chip',
    icon: 'mdi-square-rounded',
    label: 'Chip',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        modelValue: Type.String(),
        selected: Type.Boolean(),
        label: Type.String(),
        icon: Type.String({ icon: true }),
        color: Type.String({ color: true }),
        textColor: Type.String({ color: true }),
        clickable: Type.Boolean(),
        removable: Type.Boolean(),
        square: Type.Boolean(),
        outline: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'icon',
    icon: 'mdi-cube-outline',
    label: 'Icon',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        name: Type.String({ icon: true }),
        left: Type.Boolean(),
        right: Type.Boolean(),
        color: Type.String({ color: true }),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'img',
    icon: 'mdi-image',
    label: 'Image',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        src: Type.String(),
        srcset: Type.String(),
        alt: Type.String(),
        sizes: Type.String(),
        placeholderSrc: Type.String(),
        loading: StringEnum(['eager', 'lazy']),
        crossorigin: StringEnum(['anonymous', 'use-credentials']),
        decoding: StringEnum(['sync', 'async', 'auto']),
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
        fetchpriority: StringEnum(['high', 'low', 'auto']),
        draggable: Type.Boolean(),
        noSpinner: Type.Boolean(),
        noNativeMenu: Type.Boolean(),
        noTransition: Type.Boolean(),
        ratio: Type.String(),
        position: Type.String(),
        width: Type.String(),
        height: Type.String(),
        fit: StringEnum([
          'cover',
          'fill',
          'contain',
          'none',
          'scale-down',
        ]),
        spinnerColor: Type.String({ color: true }),
        spinnerSize: sizeEnum,
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      loading: 'eager',
      decoding: 'async',
      fetchpriority: 'auto',
      referrerpolicy: 'strict-origin-when-cross-origin',
      fit: 'cover',
    },
  },
  {
    type: 'video',
    icon: 'mdi-movie-open',
    label: 'Video',
    schema: properties([
      Type.Object({
        src: Type.String(),
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
      Type.Omit(commonProperties.style, ['dense']),
    ]),
    defaultValues: {
      loading: 'eager',
      fetchpriority: 'auto',
      referrerpolicy: 'strict-origin-when-cross-origin',
    },
  },
  {
    type: 'knob',
    icon: 'mdi-knob',
    label: 'Knob',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        modelValue: Type.Number({ min: 0, max: 360 }),
        angle: Type.Number({ min: 0, max: 360 }),
        reverse: Type.Boolean(),
        instantFeedback: Type.Boolean(),
        showValue: Type.Boolean(),
        min: Type.Number(),
        max: Type.Number(),
        innerMin: Type.Number(),
        innerMax: Type.Number(),
        step: Type.Number(),
        fontSize: Type.String(),
        color: Type.String({ color: true }),
        centerColor: Type.String({ color: true }),
        trackColor: Type.String({ color: true }),
        thickness: Type.Number(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
    },
  },
  {
    type: 'progress',
    icon: 'mdi-progress-helper',
    label: 'Progress',
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
    },
  },
  {
    type: 'spinner',
    icon: 'mdi-vanish',
    label: 'Spinner',
    schema: properties([
      commonProperties.size,
      Type.Object({
        color: Type.String({ color: true }),
        thickness: Type.Number(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      color: 'primary',
      thickness: 5,
    },
  },
  {
    type: 'color',
    icon: 'mdi-eyedropper-variant',
    label: 'Color',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        defaultValue: Type.String(),
        formatModel: StringEnum(['auto', 'hex', 'rgb', 'hexa', 'rgba']),
        defaultView: StringEnum(['spectrum', 'tune', 'palette']),
        noHeader: Type.Boolean(),
        noHeaderTabs: Type.Boolean(),
        noFooter: Type.Boolean(),
        square: Type.Boolean(),
        flat: Type.Boolean(),
        bordered: Type.Boolean(),
        hideBottomSpace: Type.Boolean(),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      dense: true,
      outlined: true,
      defaultView: 'palette',
      formatModel: 'auto',
    },
  },
  {
    type: 'slider',
    icon: 'mdi-tune-variant',
    label: 'Slider',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.Number(),
        label: Type.String(),
        min: Type.Number(),
        max: Type.Number(),
        innerMin: Type.Number(),
        innerMax: Type.Number(),
        step: Type.Number(),
        snap: Type.Boolean(),
        reverse: Type.Boolean(),
        vertical: Type.Boolean(),
        labelAlways: Type.Boolean(),
        switchLabelSide: Type.Boolean(),
        switchMarkerLabelSide: Type.Boolean(),
        thumbSize: sizeEnum,
        trackSize: sizeEnum,
        markers: Type.Union([Type.Boolean(), Type.Number()]),
        markerLabels: Type.Boolean(),
        color: Type.String({ color: true }),
        labelColor: Type.String({ color: true }),
        labelTextColor: Type.String({ color: true }),
        thumbColor: Type.String({ color: true }),
        innerTrackColor: Type.String({ color: true }),
        selectionColor: Type.String({ color: true }),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      step: 1,
      snap: true,
      max: 10,
      innerMax: 10,
    },
  },
  {
    type: 'range',
    icon: 'mdi-arrow-left-right',
    label: 'Range',
    schema: properties([
      commonProperties.state,
      Type.Object({
        modelValue: Type.String(),
        min: Type.Number(),
        max: Type.Number(),
        innerMin: Type.Number(),
        innerMax: Type.Number(),
        step: Type.Number(),
        snap: Type.Boolean(),
        labelAlways: Type.Boolean(),
        reverse: Type.Boolean(),
        vertical: Type.Boolean(),
        markers: Type.Union([Type.Boolean(), Type.Number()]),
        markerLabels: Type.Boolean(),
        dragRange: Type.Boolean(),
        dragOnlyRange: Type.Boolean(),
        leftLabelValue: Type.String(),
        rightLabelValue: Type.String(),
        switchLabelSide: Type.Boolean(),
        switchMarkerLabelSide: Type.Boolean(),
        thumbSize: sizeEnum,
        trackSize: sizeEnum,
        labelColor: Type.String({ color: true }),
        labelTextColor: Type.String({ color: true }),
        trackColor: Type.String({ color: true }),
        thumbColor: Type.String({ color: true }),
        selectionColor: Type.String({ color: true }),
        leftLabelColor: Type.String({ color: true }),
        leftLabelTextColor: Type.String({ color: true }),
        rightLabelColor: Type.String({ color: true }),
        rightLabelTextColor: Type.String({ color: true }),
        leftThumbColor: Type.String({ color: true }),
        rightThumbColor: Type.String({ color: true }),
      }),
      commonProperties.style,
    ]),
    defaultValues: {
      step: 1,
      snap: true,
      max: 10,
      innerMax: 10,
      labelAlways: true,
    },
  },
  {
    type: 'rating',
    icon: 'mdi-star',
    label: 'Rating',
    schema: properties([
      commonProperties.state,
      commonProperties.size,
      Type.Object({
        modelValue: Type.Number(),
        icon: Type.String({ icon: true }),
        iconSelected: Type.String({ icon: true }),
        iconHalf: Type.String({ icon: true }),
        max: Type.Number(),
        noReset: Type.Boolean(),
        noDimming: Type.Boolean(),
        color: Type.String({ color: true }),
        colorSelected: Type.String({ color: true }),
        colorHalf: Type.String({ color: true }),
      }),
      Type.Omit(commonProperties.style, ['dense']),
    ]),
    defaultValues: {
      dense: true,
      icon: 'mdi-star-outline',
      iconSelected: 'mdi-star',
      iconHalf: 'mdi-star-half-full',
      max: 5,
      size: 'sm',
      noDimming: true,
    },
  },
  {
    type: 'separator',
    icon: 'mdi-minus',
    label: 'Separator',
    schema: properties([
      Type.Object({
        spaced: Type.Boolean(),
        inset: Type.Boolean(),
        vertical: Type.Boolean(),
        color: Type.String({ color: true }),
      }),
      Type.Omit(commonProperties.style, ['dense']),
    ]),
    defaultValues: {
    },
  },
  {
    type: 'skeleton',
    icon: 'mdi-timer-sand',
    label: 'Skeleton',
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
    ]),
    defaultValues: {
    },
  },
  {
    type: 'space',
    icon: 'mdi-keyboard-space',
    label: 'Spacer',
    schema: properties([]),
    defaultValues: {
    },
  },
  {
    type: 'row',
    icon: 'mdi-view-column-outline',
    label: 'Row',
    nokey: true,
    schema: properties([
      Type.Omit(commonProperties.style, ['dense']),
    ]),
  },
  {
    type: 'col',
    icon: 'mdi-table-column',
    label: 'Column',
    nokey: true,
    hidden: true,
    schema: properties([
      Type.Object({
        col: StringEnum([
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          'auto',
        ]),
      }),
      Type.Omit(commonProperties.style, ['dense']),
    ]),
  },
] as TFormComponent[]

const newNameForField = (type: string, fields: AnyData[]): string => {
  let index = 1
  let newName = `${startCase(type)}${index}`
  let field = fields.find((f) => f.name === newName)
  while (field) {
    index += 1
    newName = `${startCase(type)}${index}`
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    field = fields.find((f) => f.name === newName)
  }
  return newName
}

const flattenFields = (fields: TFormField[]): (AnyData)[] => {
  const flattended = []

  const flatten = (list: AnyData[]): void => {
    list.forEach((f) => {
      flattended.push(f)

      if (f.columns) {
        flatten(f.columns)
      }
      if (f.fields) {
        flatten(f.fields)
      }
    })
  }

  flatten(fields)

  return flattended
}

export default () => ({

  createFormField: (component: TFormComponent, fields: TFormField[]): TFormField => ({
    _id: hexObjectId(),
    _type: component.type,
    columns: component.type === 'row' ? [] : undefined,
    fields: component.type === 'col' ? [] : undefined,
    ...Object.keys(component.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
      ), {}),
    ...(component.defaultValues || {}),
    name: newNameForField(component.type, flattenFields(fields)),
  }),

  flattenFields,

  fieldBinds: (field: TFormField, schema: TSchema): AnyData => {
    const fieldsToOmit = [
      '_id',
      '_type',
      'modelValue',
      'fields',
      'columns',
    ]

    const scanSchema = (s: TSchema): void => {
      Object.keys(s.properties).forEach((k) => {
        if (s.properties[k].skip) {
          fieldsToOmit.push(k)
        } else if (s.properties[k].type === 'object') {
          scanSchema(s.properties[k])
        }
      })
    }

    scanSchema(schema)

    return omit(field, fieldsToOmit)
  },

  componentForType,

  components,
})

import hexObjectId from 'hex-object-id'
import startCase from 'lodash/startCase'
import omit from 'lodash/omit'
import { QCheckbox, QInput, QSelect } from 'quasar'
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
    hideBottomSpace: Type.Boolean(),
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
    size: StringEnum(['xm', 'sm', 'md', 'lg', 'xl']),
  }),
}

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

export const properties = (props: TObject[]) => Type.Intersect(
  [
    commonProperties.name,
    ...props,
  ],
)

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
  componentForType: {
    text: QInput,
    number: QInput,
    checkbox: QCheckbox,
    select: QSelect,
    date: DateField,
    time: TimeField,
    color: ColorField,
    icon: IconField,
    row: FormElementRow,
  },

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

  components: [
    {
      type: 'text',
      icon: 'mdi-form-textbox',
      label: 'Text',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
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
        commonProperties.style,
        commonProperties.state,
        Type.Object({
          modelValue: Type.Boolean(),
          label: Type.String(),
          leftLabel: Type.Boolean(),
          color: Type.String({ color: true }),
          keepColor: Type.Boolean(),
          checkedIcon: Type.String({ icon: true }),
          uncheckedIcon: Type.String({ icon: true }),
        }, { additionalProperties: false }),
      ]),
      defaultValues: {
        dense: true,
      },
    },
    {
      type: 'date',
      icon: 'mdi-calendar',
      label: 'Date',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
      ]),
      defaultValues: {
        dense: true,
        outlined: true,
        calendar: 'gregorian',
        defaultView: 'Calendar',
      },
    },
    {
      type: 'time',
      icon: 'mdi-clock-outline',
      label: 'Time',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
      ]),
      defaultValues: {
        dense: true,
        outlined: true,
        calendar: 'gregorian',
      },
    },
    {
      type: 'select',
      icon: 'mdi-form-select',
      label: 'Select',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
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
      type: 'icon',
      icon: 'mdi-form-select',
      label: 'Icon Select',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
      ]),
      defaultValues: {
        dense: true,
        outlined: true,
        emitValue: true,
        useInput: true,
      },
    },
    {
      type: 'color',
      icon: 'mdi-eyedropper-variant',
      label: 'Color',
      schema: properties([
        commonProperties.style,
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
        }, { additionalProperties: false }),
      ]),
      defaultValues: {
        dense: true,
        outlined: true,
        defaultView: 'palette',
        formatModel: 'auto',
      },
    },
    {
      type: 'row',
      icon: 'mdi-view-column-outline',
      label: 'Row',
      nokey: true,
      schema: properties([
        Type.Omit(commonProperties.style, ['dense', 'hideBottomSpace']),
      ]),
    },
    {
      type: 'col',
      icon: 'mdi-table-column',
      label: 'Column',
      nokey: true,
      hidden: true,
      schema: properties([
        Type.Omit(commonProperties.style, ['dense', 'hideBottomSpace']),
        Type.Object({
          col: Type.String(),
        }, { additionalProperties: false }),
      ]),
    },
  ] as TFormComponent[],
})

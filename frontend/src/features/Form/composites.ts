import { v4 as uuidv4 } from 'uuid'
import startCase from 'lodash/startCase'
import { TObject, Type } from '@feathersjs/typebox'
import { TFormComponent, TFormField } from '@/shared/interfaces/forms'
import { defaultValueForSchema } from '@/utils/schemas'
import InputField from '@/features/Fields/components/InputField.vue'
import CheckboxField from '@/features/Fields/components/CheckboxField.vue'
import SelectField from '@/features/Fields/components/SelectField.vue'
import DateField from '@/features/Fields/components/DateField.vue'
import TimeField from '@/features/Fields/components/TimeField.vue'
import ColorField from '@/features/Fields/components/ColorField.vue'
import IconField from '@/features/Fields/components/IconField.vue'
import FormElementRow from '@/features/Form/components/FormElementRow.vue'
import { AnyData } from '@/shared/interfaces/commons'

export const commonProperties = Type.Object(
  {
    name: Type.String(),
    label: Type.String(),
    disabled: Type.Boolean(),
    readonly: Type.Boolean(),
  },
  { additionalProperties: false },
)

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

export const properties = (props: TObject) => Type.Intersect(
  [
    commonProperties,
    props,
  ],
  { additionalProperties: false },
)

const flattenFields = (fields: TFormField[]): (AnyData)[] => {
  const flattended = []

  const flatten = (list: AnyData[]): void => {
    list.forEach((f) => {
      if (f.columns) {
        flatten(f.columns)
      }
      if (f.fields) {
        flatten(f.fields)
      }
      flattended.push(f)
    })
  }

  flatten(fields)

  return flattended
}

export default () => ({
  componentsForFieldType: {
    text: InputField,
    number: InputField,
    checkbox: CheckboxField,
    select: SelectField,
    date: DateField,
    time: TimeField,
    color: ColorField,
    icon: IconField,
    row: FormElementRow,
  },

  createFormField: (component: TFormComponent, fields: TFormField[]): TFormField => ({
    _id: uuidv4(),
    _type: component.type,
    columns: component.type === 'row' ? [] : undefined,
    ...Object.keys(component.schema?.properties || {})
      .reduce((acc, k) => (
        { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
      ), {}),
    name: newNameForField(component.type, flattenFields(fields)),
  }),

  flattenFields,

  components: [
    {
      type: 'text',
      icon: 'mdi-format-text',
      label: 'Text',
      schema: properties(Type.Object(
        {
          modelValue: Type.String(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'checkbox',
      icon: 'mdi-check',
      label: 'Checkbox',
      schema: properties(Type.Object(
        {
          modelValue: Type.Boolean(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'radio',
      icon: 'mdi-radiobox-marked',
      label: 'Radio',
      schema: properties(Type.Object(
        {
          modelValue: Type.Boolean(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'date',
      icon: 'mdi-calendar',
      label: 'Date',
      schema: properties(Type.Object(
        {
          modelValue: Type.String(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'time',
      icon: 'mdi-clock-outline',
      label: 'Time',
      schema: properties(Type.Object(
        {
          modelValue: Type.String(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'select',
      icon: 'mdi-form-dropdown',
      label: 'Select',
      schema: properties(Type.Object(
        {
          modelValue: Type.Union([Type.String(), Type.Array(Type.String())]),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'icon',
      icon: 'mdi-star-face',
      label: 'Icon',
      schema: properties(Type.Object(
        {
          modelValue: Type.String(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'color',
      icon: 'mdi-eyedropper-variant',
      label: 'Color',
      schema: properties(Type.Object(
        {
          modelValue: Type.String(),
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'row',
      icon: 'mdi-view-column-outline',
      label: 'Row',
      nokey: true,
      schema: properties(Type.Object(
        {
        },
        { additionalProperties: false },
      )),
    },
    {
      type: 'col',
      icon: 'mdi-table-column',
      label: 'Column',
      nokey: true,
      hidden: true,
      schema: properties(Type.Object(
        {
        },
        { additionalProperties: false },
      )),
    },
  ] as TFormComponent[],
})

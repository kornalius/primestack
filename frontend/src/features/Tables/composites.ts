import { Static } from '@feathersjs/typebox'
import compact from 'lodash/compact'
import hexObjectId from 'hex-object-id'
import { tableFieldSchema, tableSchema } from '@/shared/schemas/table'
import { refFieldname } from '@/shared/schema'
import { AnyData } from '@/shared/interfaces/commons'

type Table = Static<typeof tableSchema>
type TableField = Static<typeof tableFieldSchema>

/**
 * Returns a list of extra fields that are not specified in the fields of tables
 *
 * @param created Created from table
 * @param updated Updated from table
 * @param softDelete SoftDelete from table
 *
 * @returns {AnyData[]} List of extra fields
 */
export const extraFields = (
  created: boolean,
  updated: boolean,
  softDelete: boolean,
): TableField[] => {
  const fields: TableField[] = []

  if (created) {
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'createdAt',
      type: 'date',
      readonly: true,
      queryable: true,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'createdBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      hidden: true,
    })
  }

  if (updated) {
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'updatedAt',
      type: 'date',
      readonly: true,
      queryable: true,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'updatedBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      hidden: true,
    })
  }

  if (softDelete) {
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'deletedAt',
      type: 'date',
      readonly: true,
      queryable: true,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: 'deletedBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      hidden: true,
    })
  }
  return fields
}

/**
 * Build a list of fields from a table
 *
 * @param fields Table fields
 * @param created Add createdAt, createdBy fields
 * @param updated Add updatedAt, updatedBy fields
 * @param softDelete Add deletedAt, deletedBy fields
 * @param userFields Add extra user fields
 *
 * @returns {TableField[]}
 */
export const tableFields = (
  fields: TableField[],
  created: boolean,
  updated: boolean,
  softDelete: boolean,
  userFields?: TableField[],
): TableField[] => {
  const separator = () => ({
    _id: hexObjectId(),
    name: '-',
    type: '',
    _internalType: 'user-table-field',
  })

  return compact([
    // _id
    fields.length ? {
      _id: hexObjectId(),
      _internalType: 'user-table-field',
      name: '_id',
      type: 'objectid',
      readonly: true,
      queryable: true,
      hidden: true,
    } : undefined,

    // fields
    ...fields,

    fields.length ? separator() : undefined,

    // Reference fields
    ...fields
      .filter((field) => field.refTableId)
      .map((field) => ({
        _id: hexObjectId(),
        _internalType: 'user-table-field',
        name: refFieldname(field.name),
        type: 'object',
        readonly: true,
        queryable: true,
        hidden: true,
      })),

    fields.length ? separator() : undefined,

    // created, updated and softDelete fields
    ...extraFields(created, updated, softDelete),

    fields.length ? separator() : undefined,

    // user fields
    ...(userFields || []),
  ])
}

/**
 * Generate a form field from a table field
 *
 * @param f Table field
 * @param addFieldToForm addFieldToForm function
 * @param t Table
 */
export const generateFormField = (
  f: TableField,
  addFieldToForm: (type: string, f: TableField, options?: AnyData) => void,
  t?: Table,
) => {
  // if field is reference to another field in a table
  if (f.refTableId) {
    addFieldToForm('lookup-select', f, {
      tableId: f.refTableId,
      columns: f.refFields.map((fc) => ({
        field: fc,
        filterable: true,
        titleClass: 'text-bold',
      })),
      labelField: f.labelField,
      valueField: f.valueField || '_id',
      multiple: f.array,
      useChips: f.chip,
    })
    return
  }

  // select from options
  if (f.options) {
    if (f.toggles) {
      addFieldToForm('button-toggle', f, {
        options: f.options,
        clearable: f.multiple,
      })
    } else {
      addFieldToForm('select', f, {
        optionLabel: 'name',
        optionValue: '_id',
        options: f.options,
        useChips: f.chip,
        multiple: f.multiple,
      })
    }
    return
  }

  switch (f.type) {
    case 'string':
      addFieldToForm('input', f)
      break

    case 'number':
      if (f.slider) {
        addFieldToForm('slider', f, {
          slider: f.slider,
          step: f.step,
          min: f.min,
          max: f.max,
        })
      } else if (f.rating) {
        addFieldToForm('rating', f, {
          rating: f.rating,
          ratingIcon: f.ratingIcon,
          ratingIconFilled: f.ratingIconFilled,
          ratingIconHalf: f.ratingIconHalf,
          min: f.min,
          max: f.max,
        })
      } else {
        addFieldToForm('input', f, {
          type: 'number',
          step: f.step,
          min: f.min,
          max: f.max,
        })
      }
      break

    case 'boolean':
      addFieldToForm('checkbox', f)
      break

    case 'date':
      addFieldToForm('date', f)
      break

    case 'time':
      addFieldToForm('time', f)
      break

    case 'color':
      addFieldToForm('color', f)
      break

    case 'icon':
      addFieldToForm('icon-select', f)
      break

    // choose from a table
    case 'objectid':
      if (t) {
        addFieldToForm('select', f, {
          optionLabel: f.labelField,
          optionValue: f.valueField || '_id',
          tableId: t._id,
          options: f.options,
          useChips: f.chip,
        })
      }
      break

    default:
  }
}

export const useTable = () => ({
  extraFields,
  tableFields,
  generateFormField,
})

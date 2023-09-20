import { Static } from '@feathersjs/typebox'
import hexObjectId from 'hex-object-id'
import { tableFieldSchema } from '@/shared/schemas/table'
import { refFieldname } from '@/shared/schema'

type TableFieldSchema = Static<typeof tableFieldSchema>

/**
 * Returns a list of extra fields that are not specified in the fields of tables
 *
 * @param created Created from table
 * @param updated Updated from table
 * @param softDelete SoftDelete from table
 *
 * @returns {AnyData[]} List of extra fields
 */
const extraFields = (
  created: boolean,
  updated: boolean,
  softDelete: boolean,
): TableFieldSchema[] => {
  const fields: TableFieldSchema[] = []

  if (created) {
    fields.push({
      _id: hexObjectId(),
      name: 'createdAt',
      type: 'date',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      name: 'createdBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
  }

  if (updated) {
    fields.push({
      _id: hexObjectId(),
      name: 'updatedAt',
      type: 'date',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      name: 'updatedBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
  }

  if (softDelete) {
    fields.push({
      _id: hexObjectId(),
      name: 'deletedAt',
      type: 'date',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
    fields.push({
      _id: hexObjectId(),
      name: 'deletedBy',
      type: 'objectid',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    })
  }
  return fields
}

export const useTable = () => ({
  extraFields,

  /**
   * Build a list of fields from a table
   *
   * @param fields Table fields
   * @param created Add createdAt, createdBy fields
   * @param updated Add updatedAt, updatedBy fields
   * @param softDelete Add deletedAt, deletedBy fields
   * @param userFields Add extra user fields
   *
   * @returns {TableFieldSchema[]}
   */
  tableFields: (
    fields: TableFieldSchema[],
    created: boolean,
    updated: boolean,
    softDelete: boolean,
    userFields?: TableFieldSchema[],
  ): TableFieldSchema[] => ([
    {
      _id: hexObjectId(),
      name: '_id',
      type: 'objectid',
      readonly: true,
      queryable: true,
      array: false,
      optional: false,
      hidden: true,
    },
    ...fields,
    ...fields
      .filter((field) => field.refTableId)
      .map((field) => ({
        _id: hexObjectId(),
        name: refFieldname(field.name),
        type: 'object',
        readonly: true,
        queryable: true,
        array: false,
        optional: false,
        hidden: true,
      })),
    ...extraFields(created, updated, softDelete),
    ...(userFields || []),
  ]),
})
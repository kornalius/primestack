import { Static, TSchema, Type } from '@feathersjs/typebox'
import { fieldSchema, formSchema } from '@/shared/schemas/form'
import { flattenFields } from '@/shared/form'
import { AnyData, T18N } from '@/shared/interfaces/commons'
import { ruleTypes } from '@/features/Components/common'
import { getParentProp, types } from '@/shared/properties'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>

export const useProperties = (t: T18N) => ({
  getParentProp,

  types,

  /**
   * Check if a form element already has the same name
   *
   * @param form Editor form
   * @param schema Schema
   * @param id Current element Id
   * @param name Name of the current element
   *
   * @returns {true | string}
   */
  nameExists: (form: Form, schema: TSchema, id: string, name: string): true | string => {
    if (schema.name === true && name && form) {
      // eslint-disable-next-line no-underscore-dangle
      const found = flattenFields(form._fields)
        .find((f: FormField) => f.name
          && f._id !== id
          && f.name.toLowerCase() === name.toLowerCase())
      if (found) {
        return t('field_errors.name')
      }
    }
    return true
  },

  /**
   * Dynamic array schema for rules editing
   *
   * @param schema Schema
   * @param val Field value
   *
   * @returns {TSchema}
   */
  dynamicArraySchema: (schema: TSchema, val: AnyData): TSchema => {
    if (schema.rules) {
      const rt = ruleTypes.find((r) => r.name === val.type)
      if (rt?.options) {
        return Type.Intersect([
          schema.items,
          rt.options,
        ])
      }
    }
    return schema.items
  },

  /**
   * Build a property sub-name from the current property name (ex: a new item in an object)
   *
   * @param propName First part of the property name
   * @param name Name of the item
   *
   * @returns {string} New item name
   */
  subPropName: (propName: string, name: string | number): string => (
    propName ? `${propName}.${name}` : name.toString()
  ),
})

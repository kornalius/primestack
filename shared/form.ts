import { Static } from '@feathersjs/typebox'
import { formSchema, columnSchema, fieldSchema } from './schemas/form'
import { hexObjectId } from './schema'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>

export const flattenFields = (fields: FormField[] | FormColumn[]): FormField[] => {
  const flattended: FormField[] | FormColumn[] = []

  const flatten = (list: FormField[] | FormColumn[]): void => {
    list.forEach((f) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      flattended.push(f as any)

      // eslint-disable-next-line no-underscore-dangle
      const cols = (f as FormField)._columns
      if (cols) {
        flatten(cols as FormColumn[])
      }

      // eslint-disable-next-line no-underscore-dangle
      const flds = (f as FormColumn)._fields
      if (flds) {
        flatten(flds as FormField[])
      }
    })
  }

  flatten(fields || [])

  return flattended as FormField[]
}

/**
 * Returns the parent field of a child
 *
 * @param form Form the field belongs to
 * @param field Field to search parent for
 *
 * @returns {FormField | FormColumn | undefined}
 */
export const parentFormField = (
  form: Form,
  field: FormField | FormColumn,
): FormField | FormColumn | undefined => {
  const searchField = (
    parent: FormField | FormColumn,
    ff: FormField | FormColumn,
  ): FormField | FormColumn | undefined => {
    if (ff._id === field._id) {
      return parent
    }

    // eslint-disable-next-line no-underscore-dangle
    const cols = (ff as FormField)._columns
    if (cols) {
      for (let i = 0; i < cols.length; i++) {
        const sf = searchField(ff, cols[i] as FormColumn)
        if (sf) {
          return sf
        }
      }
    }

    // eslint-disable-next-line no-underscore-dangle
    const flds = (ff as FormColumn)._fields
    if (flds) {
      for (let i = 0; i < flds.length; i++) {
        const sf = searchField(ff, flds[i] as FormField)
        if (sf) {
          return sf
        }
      }
    }

    return undefined
  }

  return searchField(form as unknown as FormColumn, form as unknown as FormColumn)
}

/**
 * Returns a field parent array (_fields or _cols)
 *
 * @param form Form the field belongs to
 * @param field Field to search parent for
 *
 * @returns {FormField[] | FormColumn[] | undefined}
 */
export const parentFormFieldArray = (
  form: Form,
  field: FormField | FormColumn,
): FormField[] | FormColumn[] | undefined => {
  const p = parentFormField(form, field)
  if (p) {
    // eslint-disable-next-line no-underscore-dangle
    return (p as FormField)._columns as FormColumn[] || (p as FormColumn)._fields as FormField[]
  }
  return undefined
}

/**
 * Recreate ids in a form
 *
 * @param form Form instance
 *
 * @returns {Form}
 */
export const recreateFormIds = (form: Form): Form => {
  const recreateIds = (ff: FormField | FormColumn) => {
    // eslint-disable-next-line no-param-reassign
    ff._id = hexObjectId()

    // eslint-disable-next-line no-underscore-dangle
    const cols = (ff as FormField)._columns
    if (cols) {
      for (let i = 0; i < cols.length; i++) {
        recreateIds(cols[i] as FormColumn)
      }
    }

    // eslint-disable-next-line no-underscore-dangle
    const flds = (ff as FormColumn)._fields
    if (flds) {
      for (let i = 0; i < flds.length; i++) {
        recreateIds(flds[i] as FormField)
      }
    }
  }

  recreateIds(form as unknown as FormColumn)

  return form
}

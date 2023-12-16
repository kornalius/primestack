import { ref, Ref } from 'vue'
import { Static } from '@feathersjs/typebox'
import cloneDeep from 'lodash/cloneDeep'
import hexObjectId from 'hex-object-id'
import { defineStore } from 'pinia'
import {
  columnSchema,
  fieldSchema,
  formSchema,
  formTableColumnSchema,
} from '@/shared/schemas/form'
import { newName } from '@/shared/utils'
import {
  flattenFields,
  parentFormFieldArray,
  recreateFormIds,
} from '@/shared/form'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import {
  isTable,
  newColField,
  newForm,
  newFormField,
} from '@/features/Forms/composites'
import { TFormComponent } from '@/shared/interfaces/forms'
import { componentsByType } from '@/features/Components'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type FormTableColumn = Static<typeof formTableColumnSchema>

export const useFormEditor = defineStore('form-editor', () => {
  // is the forms editor active or not?
  const formsEditor = ref(false)

  // id of the form being edited
  const formId = ref() as Ref<string>

  // forms being edited
  const forms = ref([]) as Ref<Form[]>

  // is the preview mode activated or not?
  const preview = ref(false)

  // data to preview
  const previewFormData = ref()

  // should we show the form data in preview mode?
  const showPreviewFormData = ref(false)

  /**
   * Sets the cloned forms
   *
   * @param list
   */
  const setForms = (list: Form[]) => {
    forms.value = list
  }

  /**
   * Set the forms editor mode
   *
   * @param a Active or not
   */
  const setFormsEditor = (a: boolean): void => {
    formsEditor.value = a
  }

  /**
   * Set the form id currently being edited
   *
   * @param id Id of the form
   */
  const setFormId = (id: string): void => {
    formId.value = id
  }

  /**
   * Returns the form instance from an id
   *
   * @param id Id of the form
   *
   * @returns {Form|undefined} Instance of the form
   */
  const instance = (id: string): Form | undefined => (
    forms.value?.find
      ? forms.value
        ?.find((f) => f._id === id)
      : undefined
  )

  /**
   * Returns a flattened list of instance of form's fields
   */
  const flatFields = (): FormField[] => (
    // eslint-disable-next-line no-underscore-dangle
    flattenFields(instance(formId.value)?._fields || [])
  )

  /**
   * Return the form's element instance for the table's column
   *
   * @param id Id of the form's table column
   *
   * @returns {FormTableColumn} Form's table instance
   */
  const tableColumnInstance = (id: string): FormTableColumn | undefined => {
    // eslint-disable-next-line no-underscore-dangle
    const fc = flatFields()
    for (let i = 0; i < fc.length; i++) {
      // eslint-disable-next-line no-underscore-dangle
      if (isTable(fc[i])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const col = (fc[i] as any)?.columns
          .find((c: FormTableColumn) => c._id === id)
        if (col) {
          return col
        }
      }
    }
    return undefined
  }

  /**
   * Return the parent form element instance for the table's column
   *
   * @param id Id of the form's table column
   *
   * @returns {FormField} Form's table instance
   */
  const parentTableColumnInstance = (id: string): FormField | undefined => {
    // eslint-disable-next-line no-underscore-dangle
    const fc = flatFields()
    for (let i = 0; i < fc.length; i++) {
      // eslint-disable-next-line no-underscore-dangle
      if (isTable(fc[i])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const col = (fc[i] as any)?.columns
          .find((c: FormTableColumn) => c._id === id)
        if (col) {
          return fc[i]
        }
      }
    }
    return undefined
  }

  /**
   * Returns the form field instance from an id
   *
   * @param id Id of the form field
   *
   * @returns {FormField|undefined} Instance of the form field
   */
  const fieldInstance = (id: string): FormField | FormColumn | undefined => (
    // eslint-disable-next-line no-underscore-dangle
    flatFields().find((f) => f._id === id) as FormField
  )

  /**
   * Adds a new form
   *
   * @param options Options to add to the form
   *
   * @returns {Form} New form instance
   */
  const add = (options?: AnyData): Form => {
    const f = newForm(forms.value, options)
    forms.value = [...forms.value, f]
    return f
  }

  /**
   * Duplicates a form
   *
   * @param form Form instance to duplicate
   *
   * @returns {Form} New form instance
   */
  const duplicate = (form: Form): Form => {
    const f: Form = {
      ...recreateFormIds(cloneDeep(form)),
      name: newName('form', forms.value),
    }
    forms.value = [...forms.value, f]
    return f
  }

  /**
   * Removes a form
   *
   * @param id Id of the form to remove
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string): boolean => {
    const index = forms.value
      .findIndex((f) => f._id === id)
    if (index !== -1) {
      forms.value = [
        ...forms.value.slice(0, index),
        ...forms.value.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Creates a new form field
   *
   * @param component Component type to derive new field from
   * @param options Options to add the field
   *
   * @returns {FormField | FormColumn} New form field
   */
  const createField = (
    component: TFormComponent,
    options?: AnyData,
  ): FormField | FormColumn | undefined => {
    const form = instance(formId.value)
    if (form) {
      return newFormField(component.type, flatFields(), options)
    }
    return undefined
  }

  /**
   * Adds a new field to the edited form
   *
   * @param component Component instance
   * @param options Options to add to the field
   *
   * @returns {FormField | FormColumn} New field instance
   */
  const addField = (
    component: TFormComponent,
    options?: AnyData,
  ): FormField | FormColumn | undefined => {
    const form = instance(formId.value)
    if (form) {
      const field = createField(component, options)
      if (field) {
        // eslint-disable-next-line no-underscore-dangle
        form._fields.push(field as FormField)
        return field
      }
    }
    return undefined
  }

  /**
   * Duplicates a field
   *
   * @param field Field instance
   *
   * @returns {FormField | FormColumn} New field instance
   */
  const duplicateField = (
    field: FormField | FormColumn,
  ): FormField | FormColumn | undefined => {
    const form = instance(formId.value)
    const arr = parentFormFieldArray(form, field) as unknown[]
    if (arr) {
      // eslint-disable-next-line no-underscore-dangle
      const c = componentsByType[field._type]
      if (c) {
        const newField = {
          ...cloneDeep(field),
          _id: hexObjectId(),
          // eslint-disable-next-line no-underscore-dangle
          name: newName(c.type, form._fields),
        }
        // eslint-disable-next-line no-underscore-dangle
        arr.push(newField)
        return newField
      }
    }
    return undefined
  }

  /**
   * Adds a new column to a field
   *
   * @param componentType Type of component of the field
   * @param field Field instance to add the column to
   *
   * @returns {FormColumn} New tab instance
   */
  const addColumnToField = (
    componentType: string,
    field: FormField,
  ): FormColumn => {
    let type: string

    if (componentType === 'row') {
      type = 'col'
    } else if (componentType === 'card') {
      type = 'card-section'
    }

    const col = newColField(type)
    // eslint-disable-next-line no-underscore-dangle
    field._columns.push(col)
    return col
  }

  /**
   * Removes a column from a field
   *
   * @param column Column to remove
   * @param field Field to remove the column from
   *
   * @returns {boolean} True is successful
   */
  const removeColumnFromField = (column: FormColumn, field: FormField): boolean => {
    // eslint-disable-next-line no-underscore-dangle
    const index = field._columns
      .findIndex((c) => c._id === column._id)
    if (index !== -1) {
      // eslint-disable-next-line no-underscore-dangle,no-param-reassign
      field._columns = [
        // eslint-disable-next-line no-underscore-dangle
        ...field._columns.slice(0, index),
        // eslint-disable-next-line no-underscore-dangle
        ...field._columns.slice(index + 1),
      ]
      return true
    }
    return false
  }

  /**
   * Removes a table column from a table
   *
   * @param id Id of the table column
   *
   * @returns {boolean} True is successful
   */
  const removeTableColumn = (id: string): boolean => {
    const p: AnyData = parentTableColumnInstance(id)
    if (p) {
      // eslint-disable-next-line no-underscore-dangle
      const index = p.columns
        .findIndex((c: FormTableColumn) => c._id === id)
      if (index !== -1) {
        // eslint-disable-next-line no-underscore-dangle,no-param-reassign
        p.columns = [
          // eslint-disable-next-line no-underscore-dangle
          ...p.columns.slice(0, index),
          // eslint-disable-next-line no-underscore-dangle
          ...p.columns.slice(index + 1),
        ]
        return true
      }
    }
    return false
  }

  /**
   * Duplicates a table column in a table
   *
   * @param column Table column instance
   *
   * @returns {FormTableColumn} New field instance
   */
  const duplicateTableColumn = (column: FormTableColumn): FormTableColumn | undefined => {
    const p: AnyData = parentTableColumnInstance(column._id)
    if (p) {
      const newColumn: FormTableColumn = {
        ...cloneDeep(column),
        _id: hexObjectId(),
      }
      p.columns.push(newColumn)
      return newColumn
    }
    return undefined
  }

  const setPreview = (p: boolean) => {
    preview.value = p
  }

  const setPreviewFormData = (data: AnyData | undefined) => {
    previewFormData.value = data
  }

  const setShowPreviewFormData = (show: boolean) => {
    showPreviewFormData.value = show
  }

  return {
    formsEditor,
    formId,
    forms,
    setFormId,
    setForms,
    setFormsEditor,
    instance,
    tableColumnInstance,
    parentTableColumnInstance,
    flatFields,
    fieldInstance,
    add,
    duplicate,
    remove,
    createField,
    addField,
    duplicateField,
    addColumnToField,
    removeColumnFromField,
    removeTableColumn,
    duplicateTableColumn,
    preview,
    previewFormData,
    showPreviewFormData,
    setPreview,
    setPreviewFormData,
    setShowPreviewFormData,
  }
})

import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import cloneDeep from 'lodash/cloneDeep'
import hexObjectId from 'hex-object-id'
import { defineStore } from 'pinia'
import {
  columnSchema, fieldSchema, formSchema, formTableColumnSchema,
} from '@/shared/schemas/form'
import {
  flattenFields,
  newNameForField,
  parentFormFieldArray,
  recreateFormIds,
} from '@/shared/form'
import { AnyData } from '@/shared/interfaces/commons'
// eslint-disable-next-line import/no-cycle
import { isTable } from '@/features/Forms/composites'
import { defaultValueForSchema, defaultValues } from '@/shared/schema'
import { TFormComponent } from '@/shared/interfaces/forms'
import { componentsByType } from '@/features/Components'

type Form = Static<typeof formSchema>
type FormField = Static<typeof fieldSchema>
type FormColumn = Static<typeof columnSchema>
type FormTableColumn = Static<typeof formTableColumnSchema>

export const useFormEditor = defineStore('form-editor', () => {
  const states = ref({
    // is the forms editor active or not?
    formsEditor: false,
    // id of the form being edited
    formId: undefined,
    // forms being edited
    forms: [] as Form[],
    // is the preview mode activated or not?
    preview: false,
    // data to preview
    previewFormData: undefined,
    // should we show the form data in preview mode?
    showPreviewFormData: false,
  })

  /**
   * Is the forms editor active?
   */
  const formsEditor = computed(() => (
    states.value.formsEditor
  ))

  /**
   * Id of the form being edited
   */
  const formId = computed(() => (
    states.value.formId
  ))

  /**
   * Clone of the user's forms
   */
  const forms = computed(() => (
    states.value.forms
  ))

  const preview = computed(() => states.value.preview)

  const previewFormData = computed(() => states.value.previewFormData)

  const showPreviewFormData = computed(() => states.value.showPreviewFormData)

  /**
   * Sets the cloned forms
   *
   * @param list
   */
  const setForms = (list: Form[]) => {
    states.value.forms = list
  }

  /**
   * Set the forms editor mode
   *
   * @param a Active or not
   */
  const setFormsEditor = (a: boolean): void => {
    states.value.formsEditor = a
  }

  /**
   * Set the form id currently being edited
   *
   * @param id Id of the form
   */
  const setFormId = (id: string): void => {
    states.value.formId = id
  }

  /**
   * Returns the form instance from an id
   *
   * @param id Id of the form
   *
   * @returns {Form|undefined} Instance of the form
   */
  const instance = (id: string): Form | undefined => (
    states.value.forms?.find
      ? states.value.forms
        ?.find((f) => f._id === id)
      : undefined
  )

  /**
   * Returns a flattened list of instance of form's fields
   */
  const flatFields = (): FormField[] => (
    // eslint-disable-next-line no-underscore-dangle
    flattenFields(instance(states.value.formId)?._fields || [])
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
    const f: Form = {
      _id: hexObjectId(),
      _internalType: 'form',
      name: newNameForField('form', states.value.forms),
      _fields: [],
      ...(options || {}),
    }
    states.value.forms = [...states.value.forms, f]
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
      name: newNameForField('form', states.value.forms),
    }
    states.value.forms = [...states.value.forms, f]
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
    const index = states.value.forms
      .findIndex((f) => f._id === id)
    if (index !== -1) {
      states.value.forms = [
        ...states.value.forms.slice(0, index),
        ...states.value.forms.slice(index + 1),
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
    const form = instance(states.value.formId)
    if (form) {
      return {
        _id: hexObjectId(),
        _internalType: 'field',
        _type: component.type,
        _columns: component.row ? [] : undefined,
        _fields: component.col ? [] : undefined,
        ...Object.keys(component.schema?.properties || {})
          .reduce((acc, k) => (
            { ...acc, [k]: defaultValueForSchema(component.schema.properties[k]) }
          ), {}),
        ...(defaultValues(component.defaultValues) || {}),
        name: newNameForField(component.type, flatFields()),
        ...(options || {}),
      }
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
    const form = instance(states.value.formId)
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
    const form = instance(states.value.formId)
    const arr = parentFormFieldArray(form, field) as unknown[]
    if (arr) {
      // eslint-disable-next-line no-underscore-dangle
      const c = componentsByType[field._type]
      if (c) {
        const newField = {
          ...cloneDeep(field),
          _id: hexObjectId(),
          // eslint-disable-next-line no-underscore-dangle
          name: newNameForField(c.type, form._fields),
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

    const colComponent = componentsByType[type]

    const col = {
      _id: hexObjectId(),
      _internalType: 'column',
      _type: type,
      _columns: undefined,
      _fields: [],
      size: undefined,
      ...Object.keys(colComponent.schema?.properties || {})
        .reduce((acc, k) => (
          { ...acc, [k]: defaultValueForSchema(colComponent.schema.properties[k]) }
        ), {}),
      ...(defaultValues(colComponent.defaultValues) || {}),
    } as FormColumn
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
    states.value.preview = p
  }

  const setPreviewFormData = (data: AnyData | undefined) => {
    states.value.previewFormData = data
  }

  const setShowPreviewFormData = (show: boolean) => {
    states.value.showPreviewFormData = show
  }

  return {
    states,
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

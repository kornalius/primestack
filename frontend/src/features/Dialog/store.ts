import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { Static } from '@feathersjs/typebox'
import { AnyData } from '@/shared/interfaces/commons'
import { useFeathersService } from '@/composites/feathers'
import { formSchema } from '@/shared/schemas/form'

interface DialogShowOptions {
  title: string
  persistent?: boolean
  message?: string
  formId?: string
  formData?: AnyData
  width?: string
  ok: AnyData
  cancel: AnyData
  onOk?: () => void
  onCancel?: () => void
}

type Form = Static<typeof formSchema>
export const useDialog = defineStore('dialog', () => {
  const states = ref({
    title: undefined,
    persistent: false,
    message: undefined,
    formId: undefined,
    formData: {},
    width: undefined,
    ok: undefined,
    cancel: undefined,
    onOk: undefined,
    onCancel: undefined,
  } as DialogShowOptions)

  /**
   * Returns true if the dialog is active
   */
  const active = ref(false)

  /**
   * Returns the form instance
   */
  const formInstance = computed((): Form => {
    const userForm = useFeathersService('forms').findOneInStore({ query: {} })
    return userForm.value?.list.find((f: Form) => f._id === states.value.formId)
  })

  /**
   * Returns the dialog's title
   */
  const title = computed(() => states.value.title)

  /**
   * Returns true if the dialog is persistent
   */
  const persistent = computed(() => states.value.persistent)

  /**
   * Returns the dialog's width
   */
  const width = computed(() => states.value.width)

  /**
   * Returns the dialog's message
   */
  const message = computed(() => states.value.message)

  /**
   * Returns the dialog's form to show
   */
  const formId = computed(() => states.value.formId)

  const formInstanceData = ref({})

  /**
   * Returns the dialog's form data
   */
  const formData = computed(() => formInstanceData.value)

  /**
   * Returns the dialog's ok button props
   */
  const ok = computed(() => states.value.ok)

  /**
   * Returns the dialog's cancel button props
   */
  const cancel = computed(() => states.value.cancel)

  /**
   * Returns the function to execute when the ok button is pressed
   */
  const onOk = computed(() => (
    () => {
      active.value = false
      if (states.value.onOk) {
        states.value.onOk()
      }
    }
  ))

  /**
   * Returns the function to execute when the ok button is pressed
   */
  const onCancel = computed(() => (
    () => {
      active.value = false
      if (states.value.onCancel) {
        states.value.onCancel()
      }
    }
  ))

  /**
   * Opens a dialog
   *
   * @param options
   */
  const open = (options: DialogShowOptions) => {
    states.value.width = options.width
    states.value.title = options.title
    states.value.persistent = options.persistent
    states.value.message = options.message
    states.value.formId = options.formId
    states.value.formData = options.formData
    states.value.ok = options.ok
    states.value.cancel = options.cancel
    states.value.onOk = options.onOk
    states.value.onCancel = options.onCancel
    active.value = true
  }

  /**
   * Closes the dialog currently being displayed
   */
  const close = () => {
    active.value = false
  }

  watch([() => states.value.formData, () => formInstance.value?.data], () => {
    formInstanceData.value = {
      ...(formInstance.value?.data || {}),
      ...(states.value.formData || {}),
    }
  }, { immediate: true, deep: true })

  return {
    states,
    active,
    title,
    persistent,
    width,
    message,
    formId,
    formData,
    formInstance,
    ok,
    cancel,
    onOk,
    onCancel,
    open,
    close,
  }
})

import {
  Ref, computed, ref, watch,
} from 'vue'
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
  /**
   * Returns true if the dialog is active
   */
  const active = ref(false)

  /**
   * Returns the dialog's title
   */
  const title = ref() as Ref<string>

  /**
   * Returns true if the dialog is persistent
   */
  const persistent = ref(false)

  /**
   * Returns the dialog's message
   */
  const message = ref() as Ref<string>

  /**
   * Returns the dialog's form to show
   */
  const formId = ref() as Ref<string>

  /**
   * Returns the dialog's form data
   */
  const formData = ref({})

  const formInstanceData = ref({}) as Ref<AnyData>

  /**
   * Returns the dialog's width
   */
  const width = ref() as Ref<string>

  /**
   * Returns the dialog's ok button props
   */
  const ok = ref() as Ref<AnyData>

  /**
   * Returns the dialog's cancel button props
   */
  const cancel = ref() as Ref<AnyData>

  const onOkLocal = ref() as Ref<() => void>

  const onCancelLocal = ref() as Ref<() => void>

  /**
   * Returns the form instance
   */
  const formInstance = computed((): Form => {
    const userForm = useFeathersService('forms').findOneInStore({ query: {} })
    return userForm.value?.list.find((f: Form) => f._id === formId.value)
  })

  /**
   * Returns the function to execute when the ok button is pressed
   */
  const onOk = computed(() => (
    () => {
      active.value = false
      if (onOkLocal.value) {
        onOkLocal.value()
      }
    }
  ))

  /**
   * Returns the function to execute when the ok button is pressed
   */
  const onCancel = computed(() => (
    () => {
      active.value = false
      if (onCancelLocal.value) {
        onCancelLocal.value()
      }
    }
  ))

  /**
   * Opens a dialog
   *
   * @param options
   */
  const open = (options: DialogShowOptions) => {
    width.value = options.width
    title.value = options.title
    persistent.value = options.persistent
    message.value = options.message
    formId.value = options.formId
    formData.value = options.formData
    ok.value = options.ok
    cancel.value = options.cancel
    onOkLocal.value = options.onOk
    onCancelLocal.value = options.onCancel
    active.value = true
  }

  /**
   * Closes the dialog currently being displayed
   */
  const close = () => {
    active.value = false
  }

  watch([() => formData.value, () => formInstance.value?.data], () => {
    formInstanceData.value = {
      ...(formInstance.value?.data || {}),
      ...(formData.value || {}),
    }
  }, { immediate: true, deep: true })

  return {
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

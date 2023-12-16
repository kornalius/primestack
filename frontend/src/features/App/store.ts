import { Ref, computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { defineStore } from 'pinia'
import { Static } from '@feathersjs/typebox'
import { ServiceType, useFeathersService } from '@/composites/feathers'
import { tableSchema } from '@/shared/schemas/table'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
import { schema as userSchema } from '@/shared/schemas/user'
import { AnyData } from '@/shared/interfaces/commons'
import { useAuth } from '@/features/Auth/store'

type Table = Static<typeof tableSchema>
type Menu = Static<typeof menuSchema>
type Form = Static<typeof formSchema>
type Tab = Static<typeof tabSchema>
type User = Static<typeof userSchema>

export const useApp = defineStore('app', () => {
  /**
   * Returns the current menu id
   */
  const menuId = ref() as Ref<string>

  /**
   * Returns the current tab id
   */
  const tabId = ref() as Ref<string>

  /**
   * Returns the current form id
   */
  const formId = ref() as Ref<string>

  /**
   * Returns the current table id
   */
  const tableId = ref() as Ref<string>

  /**
   * Returns the current document data
   */
  const doc = ref() as Ref<AnyData>

  /**
   * Returns the currently selected rows in the form's table
   */
  const selection = ref([]) as Ref<AnyData[]>

  /**
   * Returns the active locale code
   */
  const locale = ref(
    (localStorage.getItem('locale') || navigator.language || 'en').substring(0, 2),
  ) as Ref<string>

  /**
   * Returns true if there are rows selected in the form's table
   */
  const hasSelection = computed(() => (
    selection.value.length > 0
  ))

  const i18n = useI18n()

  const auth = useAuth()

  /**
   * Change the user's language
   *
   * @param code Locale code (ex: 'en', 'fr')
   * @param updateUser Should we also patch the user on the server
   */
  const setLocale = async (code: string, updateUser = true) => {
    locale.value = code
    localStorage.setItem('locale', code)
    i18n.locale.value = code
    if (auth.userId && updateUser) {
      const user = useFeathersService('users')
        .getFromStore(auth.userId) as ServiceType<User>
      user.value.locale = code
      await user.value.save()
    }
  }

  /**
   * Set the current menu id
   *
   * @param id Menu Id
   */
  const setMenu = (id: string) => {
    menuId.value = id
    tabId.value = undefined
    formId.value = undefined
    tableId.value = undefined
    doc.value = undefined
    selection.value = []
  }

  /**
   * Set the current tab id
   *
   * @param id Tab Id
   */
  const setTab = (id: string) => {
    tabId.value = id
    formId.value = undefined
    tableId.value = undefined
    doc.value = undefined
    selection.value = []
  }

  /**
   * Set the current form id
   *
   * @param id Form Id
   */
  const setForm = (id: string) => {
    formId.value = id
    tableId.value = undefined
    doc.value = undefined
    selection.value = []
  }

  /**
   * Set the current table id
   *
   * @param id Table Id
   */
  const setTable = (id: string) => {
    tableId.value = id
    doc.value = undefined
    selection.value = []
  }

  /**
   * Set the current document
   *
   * @param d Document data
   */
  const setDoc = (d: AnyData) => {
    doc.value = d
    selection.value = []
  }

  /**
   * Set the current form table selection
   *
   * @param rows Rows of data
   */
  const setSelection = (rows: AnyData[]) => {
    selection.value = rows
  }

  /**
   * Get the current menu instance
   *
   * @returns {Menu}
   */
  const menuInstance = computed((): Menu => {
    const userMenu = useFeathersService('menus').findOneInStore({ query: {} })
    return userMenu.value?.list.find((m: Menu) => m._id === menuId.value)
  })

  /**
   * Get the current tab instance
   *
   * @returns {Tab}
   */
  const tabInstance = computed((): Tab => (
    menuInstance.value?.tabs.find((t: Tab) => t._id === tabId.value)
  ))

  /**
   * Get the current form instance
   *
   * @returns {Form}
   */
  const formInstance = computed((): Form => {
    const userForm = useFeathersService('forms').findOneInStore({ query: {} })
    return userForm.value?.list.find((f: Form) => f._id === formId.value)
  })

  /**
   * Get the current table instance
   *
   * @returns {Table}
   */
  const tableInstance = computed((): Table => {
    const userTable = useFeathersService('tables').findOneInStore({ query: {} })
    return userTable.value?.list.find((t: Table) => t._id === tableId.value)
  })

  setLocale(locale.value, false).then(() => {})

  return {
    menuId,
    tabId,
    formId,
    tableId,
    doc,
    setMenu,
    setTab,
    setForm,
    setTable,
    setDoc,
    menuInstance,
    tabInstance,
    formInstance,
    tableInstance,
    selection,
    hasSelection,
    setSelection,
    locale,
    setLocale,
  }
})

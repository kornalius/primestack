import { computed, ref } from 'vue'
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
  const states = ref({
    menuId: undefined,
    tabId: undefined,
    formId: undefined,
    tableId: undefined,
    doc: undefined,
    selection: [] as AnyData[],
    locale: (localStorage.getItem('locale') || navigator.language || 'en').substring(0, 2),
  })

  /**
   * Returns the current menu id
   */
  const menuId = computed(() => states.value.menuId)

  /**
   * Returns the current tab id
   */
  const tabId = computed(() => states.value.tabId)

  /**
   * Returns the current form id
   */
  const formId = computed(() => states.value.formId)

  /**
   * Returns the current table id
   */
  const tableId = computed(() => states.value.tableId)

  /**
   * Returns the current document data
   */
  const doc = computed(() => states.value.doc)

  /**
   * Returns the currently selected rows in the form's table
   */
  const selection = computed(() => states.value.selection)

  /**
   * Returns true if there are rows selected in the form's table
   */
  const hasSelection = computed(() => states.value.selection.length > 0)

  /**
   * Returns the active locale code
   */
  const locale = computed(() => states.value.locale)

  const i18n = useI18n()

  const auth = useAuth()

  /**
   * Change the user's language
   *
   * @param code Locale code (ex: 'en', 'fr')
   * @param updateUser Should we also patch the user on the server
   */
  const setLocale = async (code: string, updateUser = true) => {
    states.value.locale = code
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
    states.value.menuId = id
    states.value.tabId = undefined
    states.value.formId = undefined
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  /**
   * Set the current tab id
   *
   * @param id Tab Id
   */
  const setTab = (id: string) => {
    states.value.tabId = id
    states.value.formId = undefined
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  /**
   * Set the current form id
   *
   * @param id Form Id
   */
  const setForm = (id: string) => {
    states.value.formId = id
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  /**
   * Set the current table id
   *
   * @param id Table Id
   */
  const setTable = (id: string) => {
    states.value.tableId = id
    states.value.doc = undefined
    states.value.selection = []
  }

  /**
   * Set the current document
   *
   * @param d Document data
   */
  const setDoc = (d: AnyData) => {
    states.value.doc = d
    states.value.selection = []
  }

  /**
   * Set the current form table selection
   *
   * @param rows Rows of data
   */
  const setSelection = (rows: AnyData[]) => {
    states.value.selection = rows
  }

  /**
   * Get the current menu instance
   *
   * @returns {Menu}
   */
  const menuInstance = computed((): Menu => {
    const userMenu = useFeathersService('menus').findOneInStore({ query: {} })
    return userMenu.value?.list.find((m: Menu) => m._id === states.value.menuId)
  })

  /**
   * Get the current tab instance
   *
   * @returns {Tab}
   */
  const tabInstance = computed((): Tab => (
    menuInstance.value?.tabs.find((t: Tab) => t._id === states.value.tabId)
  ))

  /**
   * Get the current form instance
   *
   * @returns {Form}
   */
  const formInstance = computed((): Form => {
    const userForm = useFeathersService('forms').findOneInStore({ query: {} })
    return userForm.value?.list.find((f: Form) => f._id === states.value.formId)
  })

  /**
   * Get the current table instance
   *
   * @returns {Table}
   */
  const tableInstance = computed((): Table => {
    const userTable = useFeathersService('tables').findOneInStore({ query: {} })
    return userTable.value?.list.find((t: Table) => t._id === states.value.tableId)
  })

  setLocale(states.value.locale, false).then(() => {})

  return {
    states,
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

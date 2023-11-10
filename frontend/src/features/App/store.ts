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
    selection: [],
    locale: (localStorage.getItem('locale') || navigator.language || 'en').substring(0, 2),
  })

  const menuId = computed(() => states.value.menuId)

  const tabId = computed(() => states.value.tabId)

  const formId = computed(() => states.value.formId)

  const tableId = computed(() => states.value.tableId)

  const doc = computed(() => states.value.doc)

  const selection = computed(() => states.value.selection)

  const hasSelection = computed(() => states.value.selection.length > 0)

  const locale = computed(() => states.value.locale)

  const i18n = useI18n()
  const auth = useAuth()

  const setLocale = async (code: string) => {
    states.value.locale = code
    localStorage.setItem('locale', code)
    i18n.locale.value = code
    if (auth.userId) {
      const user = useFeathersService('users')
        .getFromStore(auth.userId) as ServiceType<User>
      user.value.locale = code
      await user.value.save()
    }
  }

  const setMenu = (id: string) => {
    states.value.menuId = id
    states.value.tabId = undefined
    states.value.formId = undefined
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  const setTab = (id: string) => {
    states.value.tabId = id
    states.value.formId = undefined
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  const setForm = (id: string) => {
    states.value.formId = id
    states.value.tableId = undefined
    states.value.doc = undefined
    states.value.selection = []
  }

  const setTable = (id: string) => {
    states.value.tableId = id
    states.value.doc = undefined
    states.value.selection = []
  }

  const setDoc = (d: AnyData) => {
    states.value.doc = d
    states.value.selection = []
  }

  const setSelection = (rows: AnyData[]) => {
    states.value.selection = rows
  }

  const menuInstance = computed((): Menu => {
    const userMenu = useFeathersService('menus').findOneInStore({ query: {} })
    return userMenu.value?.list.find((m: Menu) => m._id === states.value.menuId)
  })

  const tabInstance = computed((): Tab => (
    menuInstance.value?.tabs.find((t: Tab) => t._id === states.value.tabId)
  ))

  const formInstance = computed((): Form => {
    const userForm = useFeathersService('forms').findOneInStore({ query: {} })
    return userForm.value?.list.find((f: Form) => f._id === states.value.formId)
  })

  const tableInstance = computed((): Table => {
    const userTable = useFeathersService('tables').findOneInStore({ query: {} })
    return userTable.value?.list.find((t: Table) => t._id === states.value.tableId)
  })

  setLocale(states.value.locale).then(() => {})

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

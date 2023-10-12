import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { Static } from '@feathersjs/typebox'
import { useFeathersService } from '@/composites/feathers'
import { tableSchema } from '@/shared/schemas/table'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'

type Table = Static<typeof tableSchema>
type Menu = Static<typeof menuSchema>
type Form = Static<typeof formSchema>
type Tab = Static<typeof tabSchema>

export const useApp = defineStore('app', () => {
  const states = ref({
    menuId: undefined,
    tabId: undefined,
    formId: undefined,
    tableId: undefined,
    doc: undefined,
    selection: [],
  })

  const menuId = computed(() => states.value.menuId)

  const tabId = computed(() => states.value.tabId)

  const formId = computed(() => states.value.formId)

  const tableId = computed(() => states.value.tableId)

  const doc = computed(() => states.value.doc)

  const selection = computed(() => states.value.selection)

  const hasSelection = computed(() => states.value.selection.length > 0)

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
  }
})

import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
// eslint-disable-next-line import/no-cycle
import { menuOrPopupPresent } from '@/features/Editor/store'

type Tab = Static<typeof tabSchema>
type Menu = Static<typeof menuSchema>
type Form = Static<typeof formSchema>

export const useTabEditor = defineStore('tab-editor', () => {
  const states = ref({
    // selected tab id
    selected: undefined,
  })

  /**
   * Selected tab id
   */
  const selected = computed(() => states.value.selected)

  /**
   * Checks to see if a tab is being selected or not
   *
   * @param id Id of the tab
   *
   * @returns {boolean} True if the tab is selected
   */
  const isSelected = (id: string): boolean => (
    states.value.selected === id
  )

  /**
   * Selects a tab
   *
   * @param id Id of the tab
   */
  const select = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = id
      return true
    }
    return false
  }

  /**
   * Unselects currently selected tab
   */
  const unselect = (): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = undefined
      return true
    }
    return false
  }

  /**
   * Adds a new tab
   *
   * @param selectIt Should we select it?
   * @param menu Menu instance to add the tab to
   * @param form Form instance associated with the tab
   *
   * @returns {Tab} New tab instance
   */
  const add = (selectIt: boolean, menu: Menu, form: Form): Tab => {
    const t: Tab = {
      _id: hexObjectId(),
      label: 'New Tab',
      icon: undefined,
      color: undefined,
      formId: form._id,
    }

    menu.tabs.push(t)
    if (selectIt) {
      select(t._id)
    }
    return t
  }

  /**
   * Removes a tab
   *
   * @param id Id of the tab to remove
   * @param menu Menu instance to remove the tab from
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string, menu: Menu): boolean => {
    const index = menu.tabs
      .findIndex((tab) => tab._id === id)
    if (index !== -1) {
      // eslint-disable-next-line no-param-reassign
      menu.tabs = [
        ...menu.tabs.slice(0, index),
        ...menu.tabs.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
    states,
    selected,
    isSelected,
    select,
    unselect,
    add,
    remove,
  }
})

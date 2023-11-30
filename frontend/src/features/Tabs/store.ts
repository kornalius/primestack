import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import cloneDeep from 'lodash/cloneDeep'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { formSchema } from '@/shared/schemas/form'
import { AnyData } from '@/shared/interfaces/commons'
import { newName } from '@/shared/utils'

type Tab = Static<typeof tabSchema>
type Menu = Static<typeof menuSchema>
type Form = Static<typeof formSchema>

export const useTabEditor = defineStore('tab-editor', () => {
  const states = ref({
    // tab id being edited
    tabId: undefined,
  })

  /**
   * Selected tab id
   */
  const tabId = computed(() => states.value.tabId)

  /**
   * Selects a tab
   *
   * @param id Id of the tab
   */
  const setTabId = (id: string): boolean => {
    states.value.tabId = id
    return true
  }

  /**
   * Adds a new tab
   *
   * @param options Options to add to the tab
   * @param menu Menu instance to add the tab to
   * @param form Form instance associated with the tab
   *
   * @returns {Tab} New tab instance
   */
  const add = (options: AnyData, menu: Menu, form?: Form): Tab => {
    const t: Tab = {
      _id: hexObjectId(),
      _internalType: 'tab',
      label: newName('tab', menu.tabs, 'label'),
      icon: 'mdi-alert',
      color: undefined,
      formId: form?._id,
      ...(options || {}),
    }
    menu.tabs.push(t)
    return t
  }

  /**
   * Duplicates a tab
   *
   * @param tab Tab instance to duplicate
   * @param menu Menu the tab belongs to
   *
   * @returns {Tab} New tab instance
   */
  const duplicate = (tab: Tab, menu: Menu): Tab => {
    const t: Tab = {
      ...cloneDeep(tab),
      _id: hexObjectId(),
    }
    menu.tabs.push(t)
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
    tabId,
    setTabId,
    add,
    duplicate,
    remove,
  }
})

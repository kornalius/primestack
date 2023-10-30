import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import hexObjectId from 'hex-object-id'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
// eslint-disable-next-line import/no-cycle
import { menuOrPopupPresent } from '@/features/Editor/store'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

export const useMenuEditor = defineStore('menu-editor', () => {
  const states = ref({
    // selected menu id
    selected: undefined,
    // menus being edited
    menus: [] as Menu[],
  })

  /**
   * Selected menu id
   */
  const selected = computed(() => states.value.selected)

  /**
   * Clone of the user's menus
   */
  const menus = computed(() => states.value.menus)

  /**
   * Set the user's menu clones
   *
   * @param list
   */
  const setMenus = (list: Menu[]) => {
    states.value.menus = list
  }

  /**
   * Checks to see if a menu is being selected or not
   *
   * @param id Id of the menu
   *
   * @returns {boolean} True if the menu is selected
   */
  const isSelected = (id: string): boolean => (
    states.value.selected === id
  )

  /**
   * Selects a menu
   *
   * @param id Id of the menu
   */
  const select = (id: string): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = id
      return true
    }
    return false
  }

  /**
   * Unselects currently selected menu
   */
  const unselect = (): boolean => {
    if (!menuOrPopupPresent()) {
      states.value.selected = undefined
      return true
    }
    return false
  }

  /**
   * Returns the menu instance from an id
   *
   * @param id Id of the menu
   *
   * @returns {Menu|undefined} Instance of the menu
   */
  const instance = (id: string): Menu | undefined => (
    states.value.menus?.find
      ? states.value.menus
        ?.find((m) => m._id === id)
      : undefined
  )

  /**
   * Returns the tab instance from an id
   *
   * @param id Id of the tab
   *
   * @returns {Tab|undefined} Instance of the tab
   */
  const tabInstance = (id: string): Tab | undefined => {
    for (let i = 0; i < states.value.menus.length; i++) {
      const m = states.value.menus[i]
      const tab = m.tabs
        .find((t) => t._id === id)
      if (tab) {
        return tab
      }
    }
    return undefined
  }

  /**
   * Adds a new menu
   *
   * @param selectIt Should we select it?
   *
   * @returns {Menu} New menu instance
   */
  const add = (selectIt?: boolean): Menu => {
    const m: Menu = {
      _id: hexObjectId(),
      label: undefined,
      icon: undefined,
      color: undefined,
      href: undefined,
      target: '_self',
      tabs: [],
      variables: [],
    }
    states.value.menus = [...states.value.menus, m]
    if (selectIt) {
      select(m._id)
    }
    return m
  }

  /**
   * Removes a menu
   *
   * @param id Id of the menu to remove
   *
   * @returns {boolean} True is successful
   */
  const remove = (id: string): boolean => {
    const index = states.value.menus
      .findIndex((m) => m._id === id)
    if (index !== -1) {
      states.value.menus = [
        ...states.value.menus.slice(0, index),
        ...states.value.menus.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
    states,
    selected,
    menus,
    setMenus,
    isSelected,
    select,
    unselect,
    instance,
    tabInstance,
    add,
    remove,
  }
})

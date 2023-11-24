import { ref, computed } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import hexObjectId from 'hex-object-id'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { recreateMenuIds } from '@/shared/menu'
import { AnyData } from '@/shared/interfaces/commons'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

export const useMenuEditor = defineStore('menu-editor', () => {
  const states = ref({
    // menu id begin edited
    menuId: undefined,
    // menus being edited
    menus: [] as Menu[],
  })

  /**
   * Menu id being edited
   */
  const menuId = computed(() => states.value.menuId)

  /**
   * Clone of the user's menus
   */
  const menus = computed(() => states.value.menus)

  /**
   * Selects a menu
   *
   * @param id Id of the menu
   */
  const setMenuId = (id: string): boolean => {
    states.value.menuId = id
    return true
  }

  /**
   * Set the user's menu clones
   *
   * @param list
   */
  const setMenus = (list: Menu[]) => {
    states.value.menus = list
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
      const tab = m?.tabs
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
   * @param options Optional values
   *
   * @returns {Menu} New menu instance
   */
  const add = (options?: AnyData): Menu => {
    const m: Menu = {
      _id: hexObjectId(),
      _internalType: 'menu',
      label: undefined,
      icon: undefined,
      color: undefined,
      href: undefined,
      target: '_self',
      tabs: [],
      variables: [],
      ...(options || {}),
    }
    states.value.menus = [...states.value.menus, m]
    return m
  }

  /**
   * Duplicates a menu
   *
   * @param menu Menu instance to duplicate
   *
   * @returns {Menu} New menu instance
   */
  const duplicate = (menu: Menu): Menu => {
    const m: Menu = recreateMenuIds(cloneDeep(menu))
    states.value.menus = [...states.value.menus, m]
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
    menuId,
    menus,
    setMenuId,
    setMenus,
    instance,
    tabInstance,
    add,
    duplicate,
    remove,
  }
})

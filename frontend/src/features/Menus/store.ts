import { ref, Ref } from 'vue'
import { Static } from '@feathersjs/typebox'
import { defineStore } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import hexObjectId from 'hex-object-id'
import { menuSchema, tabSchema } from '@/shared/schemas/menu'
import { recreateMenuIds } from '@/shared/menu'
import { AnyData } from '@/shared/interfaces/commons'
import { newName } from '@/shared/utils'

type Menu = Static<typeof menuSchema>
type Tab = Static<typeof tabSchema>

export const useMenuEditor = defineStore('menu-editor', () => {
  // menu id begin edited
  const menuId = ref() as Ref<string>

  // menus being edited
  const menus = ref([]) as Ref<Menu[]>

  /**
   * Selects a menu
   *
   * @param id Id of the menu
   */
  const setMenuId = (id: string): boolean => {
    menuId.value = id
    return true
  }

  /**
   * Set the user's menu clones
   *
   * @param list
   */
  const setMenus = (list: Menu[]) => {
    menus.value = list
  }

  /**
   * Returns the menu instance from an id
   *
   * @param id Id of the menu
   *
   * @returns {Menu|undefined} Instance of the menu
   */
  const instance = (id: string): Menu | undefined => (
    menus.value?.find
      ? menus.value
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
    for (let i = 0; i < menus.value.length; i++) {
      const m = menus.value[i]
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
      label: newName('menu', menus.value, 'label'),
      icon: 'mdi-dots-horizontal-circle',
      color: undefined,
      href: undefined,
      target: '_self',
      tabs: [],
      variables: [],
      ...(options || {}),
    }
    menus.value = [...menus.value, m]
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
    menus.value = [...menus.value, m]
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
    const index = menus.value
      .findIndex((m) => m._id === id)
    if (index !== -1) {
      menus.value = [
        ...menus.value.slice(0, index),
        ...menus.value.slice(index + 1),
      ]
      return true
    }
    return false
  }

  return {
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

import { defineStore } from 'pinia'
import { Static } from '@feathersjs/typebox'
import get from 'lodash/get'
import set from 'lodash/set'
import { computed } from 'vue'
import { schema } from '@/shared/schemas/user'
import { useAuth } from '@/features/Auth/store'
import { useFeathersService } from '@/composites/feathers'
import { ServiceInstance } from 'feathers-pinia/src/modeling'

type User = Static<typeof schema>

export const useUser = defineStore('user', () => {
  const user = computed((): ServiceInstance<User> => {
    const auth = useAuth()
    return useFeathersService('users')
      .getFromStore(auth.userId).value as ServiceInstance<User>
  })

  const settings = computed(() => (
    user.value.settings
  ))

  const sidebars = computed(() => (
    user.value.sidebars
  ))

  const getSetting = (path: string): unknown => (
    get(user.value.settings, path)
  )

  const setSetting = async (path: string, value: string) => {
    set(user.value.settings, path, value)
    return user.value.save()
  }

  const sidebarName = (formId: string, right: boolean): string => (
    `${formId}-${right ? 'right' : 'left'}`
  )

  const isSidebarOpen = (formId: string, right: boolean): boolean => (
    user.value.sidebars[sidebarName(formId, right)] || false
  )

  const setSidebar = async (formId: string, right: boolean, open: boolean) => {
    if (user.value.sidebars[sidebarName(formId, right)] !== open) {
      user.value.sidebars[sidebarName(formId, right)] = open
      await user.value.save()
    }
  }

  const openSidebar = async (formId: string, right: boolean) => (
    setSidebar(formId, right, true)
  )

  const closeSidebar = async (formId: string, right: boolean) => (
    setSidebar(formId, right, false)
  )

  return {
    user,
    settings,
    sidebars,
    getSetting,
    setSetting,
    isSidebarOpen,
    setSidebar,
    openSidebar,
    closeSidebar,
  }
})

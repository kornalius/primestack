import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFeathersService } from '@/composites/feathers'
import isNil from 'lodash/isNil'

export const useShare = defineStore('share', () => {
  const states = ref({
    shareId: undefined,
    linkClicked: undefined,
  })

  const shareId = computed(() => states.value.shareId)

  const linkClicked = computed(() => states.value.linkClicked)

  const setShareId = (id: string | undefined) => {
    states.value.shareId = id
  }

  const setLinkClicked = (timestamp: number | undefined) => {
    states.value.linkClicked = timestamp
  }

  /**
   * Checks if a menu is shared for a specific userId
   *
   * @param menuId Menu Id
   * @param userId User Id
   *
   * @returns {boolean}
   */
  const isMenuShared = async (menuId: string, userId: string): Promise<boolean> => {
    const share = await useFeathersService('shares').findOne({
      query: {
        menuId,
        userId,
      },
    })

    return !!share
  }

  /**
     * Assign a user to a shared menu
     *
     * @param sId Share Id
     * @param userId User Id
     */
  const assignUserToShare = async (sId: string, userId: string) => {
    const share = await useFeathersService('shares').get(sId)
    if (share && isNil(share.userId) && share.emailSent && share.emailClicked) {
      share.userId = userId
      await share.save()
    }
  }

  return {
    states,
    shareId,
    linkClicked,
    setShareId,
    setLinkClicked,
    isMenuShared,
    assignUserToShare,
  }
})

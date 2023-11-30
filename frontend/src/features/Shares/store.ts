import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useFeathersService } from '@/composites/feathers'
import isNil from 'lodash/isNil'

export const useShareStore = defineStore('share', () => {
  const states = ref({
  })

  const shareId = computed(() => localStorage.getItem('shareId'))

  const linkClicked = computed(() => Number(localStorage.getItem('linkClicked')))

  const setShareId = (id: string | undefined) => {
    if (id === undefined) {
      localStorage.removeItem('shareId')
    } else {
      localStorage.setItem('shareId', id)
    }
  }

  const setLinkClicked = (timestamp: number | undefined) => {
    if (timestamp === undefined) {
      localStorage.removeItem('linkClicked')
    } else {
      localStorage.setItem('linkClicked', (timestamp || 0).toString())
    }
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
     * @param clicked Timestamp of when the link was clicked
     * @param userId User Id
     */
  const assignUserToShare = async (sId: string, clicked: number, userId: string) => {
    const share = await useFeathersService('shares').get(sId)
    if (share && isNil(share.userId) && share.emailSent && !share.emailClicked) {
      share.userId = userId
      share.emailClicked = clicked
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

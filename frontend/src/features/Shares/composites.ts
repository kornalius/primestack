import isNil from 'lodash/isNil'
import { useFeathersService } from '@/composites/feathers'

export const useShare = () => ({
  /**
   * Checks if a menu is shared for a specific userId
   *
   * @param menuId Menu Id
   * @param userId User Id
   *
   * @returns {boolean}
   */
  isMenuShared: async (menuId: string, userId: string): Promise<boolean> => {
    const share = await useFeathersService('shares').findOne({
      query: {
        menuId,
        userId,
      },
    })

    return !!share
  },

  /**
   * Assign a user to a shared menu
   *
   * @param shareId Share Id
   * @param userId User Id
   */
  assignUserToShare: async (shareId: string, userId: string) => {
    const share = await useFeathersService('shares').get(shareId)
    if (share && isNil(share.userId) && share.emailSent && share.emailClicked) {
      share.userId = userId
      await share.save()
    }
  },
})
